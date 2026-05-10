# VeriPost

AI-driven fake news detector. Classifies news articles as REAL or FAKE based on linguistic patterns using a calibrated Linear SVM over TF-IDF features.

## Features

- Text, image (OCR), URL, and batch CSV input modes
- Calibrated probability scores (true 0-100% confidence)
- Word-level explainability showing what pushed the prediction REAL or FAKE
- Sentence-level breakdown
- Language detection with degraded-accuracy warning for non-English content
- Admin panel for model versioning and retraining
- Rate limiting on all prediction endpoints

## Setup

```bash
pip install -r requirements.txt
```

Place the WELFake dataset at `data/WELFake_Dataset.csv`, then train:

```bash
python trainModel.py
```

Run the app:

```bash
python app.py
```

For production, set environment variables:

```bash
FLASK_DEBUG=0
VERIPOST_ADMIN_TOKEN=your-secret-token
PORT=5000
```

Then run with gunicorn:

```bash
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

## Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Welcome page |
| `/app` | GET | Main analysis UI |
| `/admin` | GET | Admin panel (token-protected actions) |
| `/predict` | POST | `{ text, explain?, sentences? }` -> prediction |
| `/predict-url` | POST | `{ url, sentences? }` -> scrape + predict |
| `/predict-batch` | POST | multipart CSV upload |
| `/admin/versions` | GET | List trained model versions |
| `/admin/activate` | POST | `{ version }` switch active model |
| `/admin/retrain` | POST | `{ version? }` start training in background |
| `/admin/train-status` | GET | Poll training progress |
| `/health` | GET | Liveness + active version info |

## Environment

- `FLASK_DEBUG` (default `0`)
- `PORT` (default `5000`)
- `VERIPOST_ADMIN_TOKEN` (required header for admin endpoints if set)
- `VERIPOST_MAX_TEXT` (default `50000`)
- `VERIPOST_MAX_BATCH` (default `500`)
