import os
import re
import json
import argparse
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix


URL_RE = re.compile(r'http\S+')
NUM_RE = re.compile(r'\d+')
NON_ALPHA_RE = re.compile(r'[^a-zA-Z\s]')
WS_RE = re.compile(r'\s+')


def clean_text(text):
    text = text.lower()
    text = URL_RE.sub('', text)
    text = NUM_RE.sub('', text)
    text = NON_ALPHA_RE.sub('', text)
    return WS_RE.sub(' ', text).strip()


def train(dataset_path, models_dir, version_tag=None, extra_csv=None):
    os.makedirs(models_dir, exist_ok=True)
    versions_dir = os.path.join(models_dir, 'versions')
    os.makedirs(versions_dir, exist_ok=True)

    df = pd.read_csv(dataset_path).fillna('')
    if extra_csv and os.path.exists(extra_csv):
        extra = pd.read_csv(extra_csv).fillna('')
        df = pd.concat([df, extra], ignore_index=True)

    df['combined_text'] = (df['title'].astype(str) + ' ' + df['text'].astype(str))
    df = df[df['combined_text'].str.len() > 50].copy()
    df['combined_text'] = df['combined_text'].map(clean_text)

    X = df['combined_text'].values
    y = df['label'].astype(int).values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_df=0.7,
        min_df=2,
        max_features=20000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        dtype=np.float32,
    )

    Xtr = vectorizer.fit_transform(X_train)
    Xte = vectorizer.transform(X_test)

    base = LinearSVC(C=1.0)
    calibrated = CalibratedClassifierCV(base, cv=3, method='sigmoid', n_jobs=-1)
    calibrated.fit(Xtr, y_train)

    preds = calibrated.predict(Xte)
    accuracy = accuracy_score(y_test, preds) * 100

    print(f"\nModel Accuracy: {accuracy:.2f}%\n")
    print("Classification Report:\n")
    print(classification_report(y_test, preds))
    print("Confusion Matrix:\n")
    print(confusion_matrix(y_test, preds))

    cv_scores = cross_val_score(calibrated, Xtr, y_train, cv=3, n_jobs=-1)
    print("\nCV Scores:", cv_scores)
    print(f"Average CV Accuracy: {cv_scores.mean() * 100:.2f}%")

    raw_svc = LinearSVC(C=1.0).fit(Xtr, y_train)
    coefs = raw_svc.coef_[0].astype(np.float32)
    intercept = float(raw_svc.intercept_[0])

    now = datetime.now(timezone.utc)
    version = version_tag or now.strftime('%Y%m%d_%H%M%S')
    trained_at = now.isoformat().replace('+00:00', 'Z')

    joblib.dump(calibrated, os.path.join(models_dir, 'model.pkl'), compress=3)
    joblib.dump(vectorizer, os.path.join(models_dir, 'tfidfVectorizer.pkl'), compress=3)
    np.save(os.path.join(models_dir, 'coefs.npy'), coefs)
    with open(os.path.join(models_dir, 'meta.json'), 'w') as f:
        json.dump({
            'version': version,
            'accuracy': round(accuracy, 2),
            'cv_mean': round(float(cv_scores.mean()) * 100, 2),
            'trained_at': trained_at,
            'intercept': intercept,
            'n_features': int(coefs.shape[0]),
            'n_samples': int(len(X)),
        }, f, indent=2)

    vdir = os.path.join(versions_dir, version)
    os.makedirs(vdir, exist_ok=True)
    joblib.dump(calibrated, os.path.join(vdir, 'model.pkl'), compress=3)
    joblib.dump(vectorizer, os.path.join(vdir, 'tfidfVectorizer.pkl'), compress=3)
    np.save(os.path.join(vdir, 'coefs.npy'), coefs)
    with open(os.path.join(vdir, 'meta.json'), 'w') as f:
        json.dump({
            'version': version,
            'accuracy': round(accuracy, 2),
            'cv_mean': round(float(cv_scores.mean()) * 100, 2),
            'trained_at': trained_at,
            'intercept': intercept,
            'n_features': int(coefs.shape[0]),
            'n_samples': int(len(X)),
        }, f, indent=2)

    print(f"\nSaved version: {version}")
    return version, accuracy


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--data',
        default=os.environ.get(
            'VERIPOST_DATASET_PATH',
            r'C:\Users\Dell\OneDrive\Desktop\WELFake_Dataset.csv'
        )
    )
    parser.add_argument('--models-dir', default='models')
    parser.add_argument('--version', default=None)
    parser.add_argument('--extra', default=None)
    args = parser.parse_args()
    train(args.data, args.models_dir, args.version, args.extra)
