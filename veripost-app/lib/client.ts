import type {
  PredictionResult,
  BatchResult,
  VersionListResponse,
  TrainStatus,
  HealthResponse,
} from './types';

const json = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error((data && data.error) || `Request failed (${res.status})`);
  }
  return data as T;
};

export const api = {
  predict: (text: string, opts: { explain?: boolean; sentences?: boolean } = {}) =>
    fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, explain: false, ...opts }),
    }).then((r) => json<PredictionResult>(r)),

  predictBatch: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return fetch('/api/predict-batch', { method: 'POST', body: fd }).then((r) =>
      json<BatchResult>(r)
    );
  },

  versions: (token?: string) =>
    fetch('/api/admin/versions', {
      headers: token ? { 'X-Admin-Token': token } : undefined,
    }).then((r) => json<VersionListResponse>(r)),

  activate: (version: string, token?: string) =>
    fetch('/api/admin/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Admin-Token': token } : {}),
      },
      body: JSON.stringify({ version }),
    }).then((r) => json<{ activated: string }>(r)),

  retrain: (version: string | null, token?: string) =>
    fetch('/api/admin/retrain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Admin-Token': token } : {}),
      },
      body: JSON.stringify({ version }),
    }).then((r) => json<{ started: boolean }>(r)),

  trainStatus: (token?: string) =>
    fetch('/api/admin/train-status', {
      headers: token ? { 'X-Admin-Token': token } : undefined,
    }).then((r) => json<TrainStatus>(r)),

  health: () => fetch('/api/health').then((r) => json<HealthResponse>(r)),
};
