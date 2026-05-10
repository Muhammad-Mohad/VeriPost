export const formatPercent = (value: number, digits = 2) =>
  `${value.toFixed(digits)}%`;

export const formatDate = (iso?: string) => {
  if (!iso) return 'n/a';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const formatNumber = (n?: number | null) => {
  if (n === null || n === undefined) return 'n/a';
  return n.toLocaleString();
};

export const truncate = (text: string, max = 140) =>
  text.length > max ? `${text.slice(0, max)}…` : text;
