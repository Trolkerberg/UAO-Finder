import { TorchClassifierNative } from './TorchClassifier';

const CLASS_NAMES = [
  "Arco",
  "Aulas 1",
  "Aulas 2",
  "Sótano 1",
  "Sótano 2",
  "Cafetería"
];

export class ResnetClassifierReal {

  async classify(imageData: any) {
    const result = await TorchClassifierNative.predict(imageData);

    return {
      landmark: CLASS_NAMES[result.classIndex] ?? 'Desconocido',
      confidence: result.confidence,
      timestamp: Date.now(),
    };
  }
}