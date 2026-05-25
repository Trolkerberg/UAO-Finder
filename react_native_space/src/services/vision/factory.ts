import { MockClassifier } from './MockClassifier';
import { ResnetClassifierReal } from './ResNetClassifier';

const USE_REAL_MODEL = false; // 🔥 cambia esto

export function createClassifier() {
  if (USE_REAL_MODEL) {
    return new ResnetClassifierReal();
  }

  return new MockClassifier();
}