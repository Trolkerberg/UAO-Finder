import { IVisionDetector } from './types';
import { MockDetector } from './MockDetector';

/**
 * Factory function to create a vision detector.
 * Currently returns MockDetector. Swap with RealDetector when TFLite model is ready.
 *
 * Usage:
 *   const detector = createVisionDetector();
 *   const result = await detector.detect(cameraFrame);
 */
export function createVisionDetector(): IVisionDetector {
  // TODO: Replace with RealDetector when TFLite model is integrated
  // return new RealDetector(modelPath);
  return new MockDetector();
}
