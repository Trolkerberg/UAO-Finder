import { DetectionResult } from '../../utils/types';

/**
 * Interface for vision detection.
 * Implement this interface with a real TFLite model in the future.
 */
export interface IVisionDetector {
  /**
   * Detect landmarks from camera image data.
   * @param imageData - Camera frame data (unused in mock, will be real tensor in production)
   * @returns Detection result with landmark name, confidence, and bounding box
   */
  detect(imageData?: unknown): Promise<DetectionResult>;

  /** Human-readable name of the detector */
  readonly name: string;
}
