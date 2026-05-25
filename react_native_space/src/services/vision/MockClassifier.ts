import { detectableLandmarks } from '../../data/landmarks';

export interface ClassificationResult {
  landmark: string;
  confidence: number;
  timestamp: number;
}

export class MockClassifier {
  readonly name = 'MockClassifier';

  async classify(): Promise<ClassificationResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const available = detectableLandmarks ?? [];
    const randomIndex = Math.floor(Math.random() * (available.length || 1));
    const landmark = available[randomIndex];

    const confidence =
      Math.round((Math.random() * 0.79 + 0.2) * 100) / 100;

    return {
      landmark: landmark?.name ?? 'Desconocido',
      confidence,
      timestamp: Date.now(),
    };
  }
}