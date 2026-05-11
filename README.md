# VeriPost — AI-Powered Fake News Detector

VeriPost is a full-stack fake news detection system built on a machine learning model trained on the WELFake dataset (72,000+ news articles). It combines a Flask ML backend with a modern Next.js frontend to let users analyze news articles by text, URL, or bulk CSV upload.

---

## Features

- **Text Analysis** — Paste any article or headline and get an instant real/fake verdict with confidence score
- **URL Analysis** — Provide a news article URL and the system extracts and analyzes its content automatically
- **Batch CSV Processing** — Upload a CSV file with hundreds of articles and analyze them all at once
- **Sentence-Level Breakdown** — Toggle sentence mode to see per-sentence credibility scores across an article
- **Language Detection** — Detects non-English input and warns about potential accuracy degradation
- **Model Versioning** — Admin panel for managing, comparing, and switching between trained model versions
- **Live Retraining** — Trigger a full model retrain from the admin panel and watch training logs in real time
- **Health Monitoring** — Live model health status displayed in the sidebar

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| ML Model | LinearSVC + CalibratedClassifierCV (scikit-learn) |
| Vectorizer | TF-IDF (20,000 features, unigrams + bigrams) |
| Dataset | WELFake (72,134 labeled news articles) |
| Backend | Flask 3, Flask-Limiter, trafilatura, langdetect |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Icons | Lucide React |
| OCR | Tesseract.js (image-to-text in browser) |

---

## Project Structure

```
VeriPost/
├── app.py                  # Flask REST API
├── trainModel.py           # Model training script
├── nlp_utils.py            # Text cleaning, sentence splitting, explanation
├── requirements.txt        # Python dependencies
├── start.bat               # One-click Windows launcher
├── .env                    # Environment configuration
├── models/
│   ├── model.pkl           # Trained classifier
│   ├── tfidfVectorizer.pkl # Fitted TF-IDF vectorizer
│   ├── coefs.npy           # Feature coefficients for explainability
│   ├── meta.json           # Training metadata
│   └── versions/           # Archived model snapshots
└── veripost-app/           # Next.js frontend
    ├── app/                # App Router pages
    ├── components/         # Modular React components
    ├── lib/                # API client, utilities, types
    └── public/             # Static assets
```

---

## Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- WELFake dataset CSV (only needed for retraining)

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/VeriPost.git
cd VeriPost
```

### 2. Set up Python environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Set up Next.js frontend

```powershell
cd veripost-app
npm install
cd ..
```

### 4. Configure environment variables

The `.env` file is included in this repo. Update it with your own values:

```env
VERIPOST_DATASET_PATH=C:\path\to\WELFake_Dataset.csv
VERIPOST_ADMIN_TOKEN=your-secret-admin-token
VERIPOST_MAX_TEXT=50000
VERIPOST_MAX_BATCH=500
FLASK_DEBUG=0
PORT=5000
```

### 5. Train the model (optional — pre-trained models are included)

```powershell
python trainModel.py
```

### 6. Start the application

**Option A — One click (Windows):**

Double-click `start.bat`

**Option B — Manual:**

Terminal 1 (Flask):
```powershell
.\venv\Scripts\Activate.ps1
python app.py
```

Terminal 2 (Next.js):
```powershell
cd veripost-app
npm run dev
```

Then open `http://localhost:3000`

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VERIPOST_DATASET_PATH` | Desktop path | Path to WELFake CSV for retraining |
| `VERIPOST_ADMIN_TOKEN` | *(empty)* | Token required for admin panel access |
| `VERIPOST_MAX_TEXT` | `50000` | Maximum characters per text input |
| `VERIPOST_MAX_BATCH` | `500` | Maximum rows per CSV batch upload |
| `FLASK_DEBUG` | `0` | Enable Flask debug mode (`1` = on) |
| `PORT` | `5000` | Flask server port |
| `FLASK_API_URL` | `http://localhost:5000` | Backend URL used by Next.js (set this on Vercel) |

---

## API Reference

All endpoints are on the Flask backend (`localhost:5000`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Analyze a single text |
| `POST` | `/predict-url` | Fetch and analyze a URL |
| `POST` | `/predict-batch` | Analyze a CSV file |
| `GET` | `/health` | Model health check |
| `GET` | `/admin/versions` | List model versions |
| `POST` | `/admin/activate` | Switch active model version |
| `POST` | `/admin/retrain` | Trigger background retraining |
| `GET` | `/admin/train-status` | Poll training progress |

All admin endpoints require the `X-Admin-Token` header.

---

## Deployment

> The frontend (Next.js) can be deployed to **Vercel** for free. The backend (Flask) can be deployed to **Render** for free.

### Step 1 — Deploy Flask backend to Render

1. Create an account at [render.com](https://render.com)
2. Click **New → Web Service** and connect your GitHub repository
3. Configure the service:
   - **Root Directory:** *(leave empty)*
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1`
   - **Instance Type:** Free
4. Add these environment variables on Render:
   - `VERIPOST_ADMIN_TOKEN` → your secret token
   - `VERIPOST_MAX_TEXT` → `50000`
   - `VERIPOST_MAX_BATCH` → `500`
5. Click **Deploy** and copy your Render URL (e.g. `https://veripost-api.onrender.com`)

> **Note:** The free tier spins down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds to wake up. Retraining is disabled on Render since the dataset is not available on the server.

### Step 2 — Deploy Next.js frontend to Vercel

1. Create an account at [vercel.com](https://vercel.com)
2. Click **Add New → Project** and import your GitHub repository
3. Configure the project:
   - **Root Directory:** `veripost-app`
   - **Framework Preset:** Next.js *(auto-detected)*
4. Add this environment variable:
   - `FLASK_API_URL` → your Render URL from Step 1
5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app`

---

## Admin Panel

Visit `/admin` and enter your `VERIPOST_ADMIN_TOKEN` to access:

- Live model metadata (accuracy, training samples, TF-IDF features)
- Model version history with timestamps
- One-click model version switching
- Trigger retraining with a custom version tag
- Real-time training log output

---

## Model Details

- **Algorithm:** LinearSVC wrapped in CalibratedClassifierCV for probability calibration
- **Vectorizer:** TF-IDF with 20,000 features (unigrams + bigrams), sublinear TF scaling
- **Dataset:** WELFake — 72,134 articles (35,028 real, 37,106 fake) from four news sources
- **Accuracy:** ~94–96% on held-out test set
- **Label encoding:** 0 = REAL, 1 = FAKE

---

## License

MIT License. See `LICENSE` for details.
