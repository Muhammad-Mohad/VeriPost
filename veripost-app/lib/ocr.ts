export interface OcrProgress {
  status: string;
  progress: number;
}

export const runOcr = async (
  file: File,
  onProgress?: (p: OcrProgress) => void
): Promise<string> => {
  const Tesseract = (await import('tesseract.js')).default;
  const result = await Tesseract.recognize(file, 'eng', {
    logger: (m) => {
      if (onProgress && m.status) {
        onProgress({ status: m.status, progress: m.progress ?? 0 });
      }
    },
  });
  return result.data.text.trim();
};
