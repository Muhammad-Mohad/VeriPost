export type Verdict = 'REAL' | 'FAKE';

export interface ExplanationWord {
  word: string;
  weight: number;
}

export interface Explanation {
  top_real: ExplanationWord[];
  top_fake: ExplanationWord[];
  margin: number;
}

export interface SentenceResult {
  text: string;
  prediction: Verdict;
  real_probability: number;
  confidence: number;
}

export interface PredictionResult {
  prediction: Verdict;
  confidence_score: number;
  real_probability: number;
  language: string;
  language_warning: string | null;
  explanation?: Explanation;
  sentences?: SentenceResult[];
  source_url?: string;
  extracted_text?: string;
}

export interface BatchRow {
  index: number;
  snippet: string;
  prediction: Verdict;
  real_probability: number;
  confidence: number;
}

export interface BatchResult {
  total: number;
  fake_count: number;
  real_count: number;
  rows: BatchRow[];
}

export interface ModelMeta {
  version?: string;
  accuracy?: number;
  cv_mean?: number;
  trained_at?: string;
  intercept?: number;
  n_features?: number;
  n_samples?: number;
}

export interface VersionListResponse {
  current: ModelMeta;
  versions: ModelMeta[];
}

export interface TrainStatus {
  running: boolean;
  last_log: string;
  last_version: string | null;
}

export interface HealthResponse {
  ok: boolean;
  version?: string;
  accuracy?: number;
}

export interface ApiError {
  error: string;
}
