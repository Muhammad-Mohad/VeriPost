# VeriPost — Next.js App

Modern dashboard for the VeriPost fake news detector. Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. Talks to the existing Flask ML backend via thin server-side proxy routes.

## Architecture

```
[ Browser ]  →  [ Next.js (3000) ]  →  [ Flask (5000) — sklearn model ]
```

- **Next.js** owns the UI, OCR (Tesseract.js client-side), and CSV download.
- **Flask** owns the calibrated SVM, TF-IDF vectorizer, training, and versioning.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Dashboard hero + quick actions + active model snapshot |
| `/analyze` | Single post analysis (Text / Image / URL tabs) with verdict, confidence ring, word-level explainability, and optional sentence-level breakdown |
| `/batch` | CSV upload to validate the authenticity of many posts in one shot |
| `/performance` | **Check Model Performance** menu — accuracy, CV mean, training samples, feature count, full version timeline |
| `/admin` | Token-protected retraining and version activation |

## Setup

```bash
cd veripost-app
cp .env.local.example .env.local
npm install
npm run dev
```

The Flask backend must be running:

```bash
cd ..
python app.py
```

By default the Next app proxies to `http://localhost:5000`. Override via `FLASK_API_URL` in `.env.local`.

## Folder layout (modular)

```
app/                   # Next.js routes + API proxies
components/
  layout/              # Sidebar, AppShell, NavItem, Logo, HealthPill, TopBar
  ui/                  # Card, Button, Badge, Input, Tabs, Meter, Spinner, …
  analyze/             # TextAnalyzer, ImageAnalyzer, UrlAnalyzer, ResultPanel, …
  batch/               # CsvDropzone, BatchSummary, BatchTable
  performance/         # MetricsGrid, ActiveModelCard, VersionTimeline
  admin/               # TokenField, RetrainPanel
  dashboard/           # HeroPanel, QuickActions, ModelSnapshot, FeatureBullets
lib/                   # client.ts, flask.ts, types.ts, ocr.ts, csv.ts, format.ts, nav.ts
```

Every interactive surface is broken into a single-purpose component so logic is easy to swap or reuse.

## Production build

```bash
npm run build
npm start
```
