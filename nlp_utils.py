import re
import numpy as np

URL_RE = re.compile(r'http\S+')
NUM_RE = re.compile(r'\d+')
NON_ALPHA_RE = re.compile(r'[^a-zA-Z\s]')
WS_RE = re.compile(r'\s+')
SENT_SPLIT_RE = re.compile(r'(?<=[.!?])\s+(?=[A-Z0-9"\'])')


def clean_text(text):
    text = text.lower()
    text = URL_RE.sub('', text)
    text = NUM_RE.sub('', text)
    text = NON_ALPHA_RE.sub('', text)
    return WS_RE.sub(' ', text).strip()


def split_sentences(text, min_len=15):
    text = text.strip()
    if not text:
        return []
    parts = SENT_SPLIT_RE.split(text)
    return [p.strip() for p in parts if len(p.strip()) >= min_len]


def explain(vectorizer, coefs, intercept, raw_text):
    cleaned = clean_text(raw_text)
    if not cleaned:
        return {'top_real': [], 'top_fake': [], 'margin': 0.0}
    vec = vectorizer.transform([cleaned])
    contribs = vec.multiply(coefs).tocoo()
    if contribs.nnz == 0:
        return {'top_real': [], 'top_fake': [], 'margin': float(intercept)}
    feature_names = vectorizer.get_feature_names_out()
    cols = contribs.col
    vals = contribs.data
    margin = float(vals.sum() + intercept)
    order = np.argsort(vals)
    top_fake_idx = order[:5]
    top_real_idx = order[-5:][::-1]
    top_fake = [
        {'word': feature_names[cols[i]], 'weight': round(float(vals[i]), 4)}
        for i in top_fake_idx if vals[i] < 0
    ]
    top_real = [
        {'word': feature_names[cols[i]], 'weight': round(float(vals[i]), 4)}
        for i in top_real_idx if vals[i] > 0
    ]
    return {'top_real': top_real, 'top_fake': top_fake, 'margin': round(margin, 4)}
