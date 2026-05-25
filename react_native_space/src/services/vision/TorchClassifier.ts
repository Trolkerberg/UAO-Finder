import { NativeModules } from 'react-native';

const { TorchModule } = NativeModules;

export interface NativePrediction {
  classIndex: number;
  confidence: number;
}

export class TorchClassifierNative {
  static async predict(imageData: any): Promise<NativePrediction> {
    if (!TorchModule) {
      throw new Error('TorchModule no disponible');
    }

    return await TorchModule.predict(imageData);
  }
}