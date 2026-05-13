import os
import io
import json
import threading
import subprocess
import sys

import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, render_template, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from nlp_utils import clean_text, split_sentences, explain

try:
    from langdetect import detect, DetectorFactory
    DetectorFactory.seed = 0
except Exception:
    detect = None


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
MAX_TEXT_LEN = int(os.environ.get('VERIPOST_MAX_TEXT', '50000'))
MAX_BATCH_ROWS = int(os.environ.get('VERIPOST_MAX_BATCH', '500'))
ADMIN_TOKEN = os.environ.get('VERIPOST_ADMIN_TOKEN', '')
DATASET_PATH = os.environ.get(
    'VERIPOST_DATASET_PATH',
    r'C:\Users\Dell\OneDrive\Desktop\WELFake_Dataset.csv'
)
DEBUG = os.environ.get('FLASK_DEBUG', '0') == '1'

app = Flask(__name__)
limiter = Limiter(get_remote_address, app=app, default_limits=['200 per hour'])

_state_lock = threading.RLock()
_state = {'model': None, 'vectorizer': None, 'coefs': None, 'intercept': 0.0, 'meta': {}}


def _load_one(path):
    try:
        return joblib.load(path)
    except Exception:
        with open(path, 'rb') as f:
            import pickle
            return pickle.load(f)


def _extract_coefs(model):
    if hasattr(model, 'coef_'):
        c = model.coef_
        return np.asarray(c[0] if c.ndim > 1 else c, dtype=np.float32), float(getattr(model, 'intercept_', [0.0])[0])
    if hasattr(model, 'calibrated_classifiers_'):
        coefs_list = []
        intercepts = []
        for cc in model.calibrated_classifiers_:
            est = getattr(cc, 'estimator', None) or getattr(cc, 'base_estimator', None)
            if est is not None and hasattr(est, 'coef_'):
                coefs_list.append(est.coef_[0])
                intercepts.append(float(est.intercept_[0]))
        if coefs_list:
            return np.mean(coefs_list, axis=0).astype(np.float32), float(np.mean(intercepts))
    return None, 0.0


def load_artifacts(version=None):
    base = os.path.join(MODELS_DIR, 'versions', version) if version else MODELS_DIR
    model = _load_one(os.path.join(base, 'model.pkl'))
    vectorizer = _load_one(os.path.join(base, 'tfidfVectorizer.pkl'))
    coefs_path = os.path.join(base, 'coefs.npy')
    meta_path = os.path.join(base, 'meta.json')
    main_meta_path = os.path.join(MODELS_DIR, 'meta.json')

    meta = {}
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            meta = json.load(f)

    if version and 'n_samples' not in meta and os.path.exists(main_meta_path):
        with open(main_meta_path) as f:
            main_meta = json.load(f)
        if main_meta.get('version') == meta.get('version'):
            meta.update({k: main_meta[k] for k in ('n_features', 'n_samples', 'intercept') if k in main_meta and k not in meta})

    if os.path.exists(coefs_path):
        coefs = np.load(coefs_path)
        intercept = float(meta.get('intercept', 0.0))
    else:
        coefs, intercept = _extract_coefs(model)

    if 'n_features' not in meta and coefs is not None:
        meta['n_features'] = int(coefs.shape[0])
    with _state_lock:
        _state['model'] = model
        _state['vectorizer'] = vectorizer
        _state['coefs'] = coefs
        _state['intercept'] = intercept
        _state['meta'] = meta


try:
    load_artifacts()
except FileNotFoundError:
    print('Warning: model artifacts missing. Train the model first.')


def _self_test():
    if _state['model'] is None:
        return
    real_probe = (
        'Reuters reports that the United States Senate voted on Tuesday to confirm the '
        'nominee for Secretary of the Treasury after several hours of debate among lawmakers.'
    )
    fake_probe = (
        'BREAKING shocking truth deep state globalists EXPOSED hidden agenda mainstream media '
        'refuses to cover this bombshell wake up sheeple share before deleted'
    )
    labels, real_p, _ = predict_batch([real_probe, fake_probe])
    ok = labels[1] == 'REAL' and labels[0] == 'FAKE'
    status = 'PASS' if ok else 'FAIL'
    print(f'[self-test] {status}  real_probe -> {labels[0]} ({real_p[0]:.2f})  fake_probe -> {labels[1]} ({real_p[1]:.2f})')
    if not ok:
        print('[self-test] WARNING: label mapping looks inverted. Check predict_batch.')


def predict_batch(texts):
    cleaned = [clean_text(t) for t in texts]
    with _state_lock:
        vec = _state['vectorizer']
        model = _state['model']
    X = vec.transform(cleaned)
    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(X)
        classes = model.classes_
        real_idx = int(np.where(classes == 0)[0][0])
        real_p = probs[:, real_idx]
    else:
        margins = model.decision_function(X)
        real_p = 1.0 / (1.0 + np.exp(margins))
    labels = np.where(real_p >= 0.5, 'REAL', 'FAKE')
    confidences = np.maximum(real_p, 1 - real_p)
    return labels, real_p, confidences


_self_test()


def _detect_lang(text):
    if not detect:
        return 'unknown'
    try:
        return detect(text[:1000])
    except Exception:
        return 'unknown'


@app.route('/')
def welcome():
    return render_template('welcome.html')


@app.route('/app')
def index():
    return render_template('index.html')


@app.route('/admin')
def admin_page():
    return render_template('admin.html')


@app.route('/predict', methods=['POST'])
@limiter.limit('60 per minute')
def predict():
    if _state['model'] is None:
        return jsonify({'error': 'Model not loaded'}), 503

    data = request.get_json(silent=True) or {}
    text = (data.get('text') or '').strip()
    want_explain = bool(data.get('explain', True))
    want_sentences = bool(data.get('sentences', False))

    if not text:
        return jsonify({'error': 'No text provided'}), 400
    if len(text) > MAX_TEXT_LEN:
        return jsonify({'error': f'Text exceeds {MAX_TEXT_LEN} chars'}), 413

    lang = _detect_lang(text)
    lang_warning = None
    if lang not in ('en', 'unknown'):
        lang_warning = f'Detected language: {lang}. Model trained on English; accuracy may degrade.'

    labels, real_probs, confs = predict_batch([text])
    label = str(labels[0])
    real_p = float(real_probs[0])
    confidence = float(confs[0])

    response = {
        'prediction': label,
        'confidence_score': round(confidence * 100, 2),
        'real_probability': round(real_p * 100, 2),
        'language': lang,
        'language_warning': lang_warning,
    }

    if want_explain and _state['coefs'] is not None:
        response['explanation'] = explain(
            _state['vectorizer'], _state['coefs'], _state['intercept'], text
        )

    if want_sentences:
        sents = split_sentences(text)
        if sents:
            s_labels, s_real, s_conf = predict_batch(sents)
            response['sentences'] = [
                {
                    'text': s,
                    'prediction': str(s_labels[i]),
                    'real_probability': round(float(s_real[i]) * 100, 2),
                    'confidence': round(float(s_conf[i]) * 100, 2),
                }
                for i, s in enumerate(sents)
            ]
        else:
            response['sentences'] = []

    return jsonify(response)


@app.route('/predict-batch', methods=['POST'])
@limiter.limit('5 per minute')
def predict_batch_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    f = request.files['file']
    raw = f.read()
    if len(raw) > 5 * 1024 * 1024:
        return jsonify({'error': 'File exceeds 5MB'}), 413
    try:
        df = pd.read_csv(io.BytesIO(raw)).fillna('')
    except Exception as e:
        return jsonify({'error': f'Could not parse CSV: {e}'}), 400

    text_col = None
    for c in ('text', 'content', 'article', 'body'):
        if c in df.columns:
            text_col = c
            break
    if text_col is None:
        return jsonify({'error': "CSV must include a 'text' column"}), 400

    if 'title' in df.columns:
        texts = (df['title'].astype(str) + ' ' + df[text_col].astype(str)).tolist()
    else:
        texts = df[text_col].astype(str).tolist()

    texts = texts[:MAX_BATCH_ROWS]
    if not texts:
        return jsonify({'error': 'Empty CSV'}), 400

    labels, real_probs, confs = predict_batch(texts)
    rows = []
    for i, t in enumerate(texts):
        snippet = t[:140] + ('…' if len(t) > 140 else '')
        rows.append({
            'index': i,
            'snippet': snippet,
            'prediction': str(labels[i]),
            'real_probability': round(float(real_probs[i]) * 100, 2),
            'confidence': round(float(confs[i]) * 100, 2),
        })
    fake_count = int((labels == 'FAKE').sum())
    real_count = int((labels == 'REAL').sum())
    return jsonify({
        'total': len(rows),
        'fake_count': fake_count,
        'real_count': real_count,
        'rows': rows,
    })


def _check_admin():
    if not ADMIN_TOKEN:
        return True
    token = request.headers.get('X-Admin-Token') or (request.get_json(silent=True) or {}).get('token', '')
    return token == ADMIN_TOKEN


@app.route('/admin/versions', methods=['GET'])
def list_versions():
    vdir = os.path.join(MODELS_DIR, 'versions')
    versions = []
    if os.path.isdir(vdir):
        for v in sorted(os.listdir(vdir), reverse=True):
            meta_path = os.path.join(vdir, v, 'meta.json')
            if os.path.exists(meta_path):
                with open(meta_path) as f:
                    versions.append(json.load(f))
    return jsonify({'current': _state['meta'], 'versions': versions})


@app.route('/admin/activate', methods=['POST'])
def activate_version():
    if not _check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    data = request.get_json(silent=True) or {}
    version = data.get('version')
    if not version:
        return jsonify({'error': 'version required'}), 400
    vpath = os.path.join(MODELS_DIR, 'versions', version)
    if not os.path.isdir(vpath):
        return jsonify({'error': 'Version not found'}), 404
    try:
        load_artifacts(version=version)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    return jsonify({'activated': version, 'meta': _state['meta']})


_train_status = {'running': False, 'last_log': '', 'last_version': None}


def _run_training(version):
    _train_status['running'] = True
    try:
        cmd = [
            sys.executable,
            os.path.join(BASE_DIR, 'trainModel.py'),
            '--data', DATASET_PATH,
        ]
        if version:
            cmd += ['--version', version]
        proc = subprocess.run(cmd, capture_output=True, text=True, cwd=BASE_DIR)
        _train_status['last_log'] = (proc.stdout + '\n' + proc.stderr)[-4000:]
        _train_status['last_version'] = version
        if proc.returncode == 0 and version:
            try:
                load_artifacts(version=version)
            except Exception as e:
                _train_status['last_log'] += f'\nLoad failed: {e}'
    finally:
        _train_status['running'] = False


@app.route('/admin/retrain', methods=['POST'])
def retrain():
    if not _check_admin():
        return jsonify({'error': 'Unauthorized'}), 401
    if _train_status['running']:
        return jsonify({'error': 'Training already in progress'}), 409
    data = request.get_json(silent=True) or {}
    version = data.get('version')
    threading.Thread(target=_run_training, args=(version,), daemon=True).start()
    return jsonify({'started': True, 'version': version})


@app.route('/admin/train-status', methods=['GET'])
def train_status():
    return jsonify(_train_status)


@app.route('/health')
def health():
    return jsonify({
        'ok': _state['model'] is not None,
        'version': _state['meta'].get('version'),
        'accuracy': _state['meta'].get('accuracy'),
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=DEBUG)
