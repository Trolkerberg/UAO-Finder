import { IVisionDetector } from './types';
import { DetectionResult } from '../../utils/types';
import { detectableLandmarks } from '../../data/landmarks';

/**
 * Mock implementation of the vision detector.
 * Returns random landmarks with random confidence scores.
 * Replace with real TFLite/Faster R-CNN detector in production.
 */
export class MockDetector implements IVisionDetector {
  readonly name = 'MockDetector (Simulated Faster R-CNN)';

  async detect(_imageData?: unknown): Promise<DetectionResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const available = detectableLandmarks ?? [];
    const randomIndex = Math.floor(Math.random() * (available?.length ?? 1));
    const landmark = available?.[randomIndex];

    // Random confidence between 0.20 and 0.99
    const confidence = Math.round((Math.random() * 0.79 + 0.2) * 100) / 100;

    // Random bounding box
    const x = Math.random() * 0.3 + 0.2;
    const y = Math.random() * 0.3 + 0.2;

    return {
      landmark: landmark?.name ?? 'Desconocido',
      confidence,
      boundingBox: {
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
        w: 0.4,
        h: 0.35,
      },
      timestamp: Date.now(),
    };
  }
}
