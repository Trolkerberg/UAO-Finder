//import React, { useState } from 'react';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  //Platform,
  ActivityIndicator,
  //Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Gradients, Spacing, BorderRadius } from '../../src/utils/constants';
import { MockClassifier } from '../../src/services/vision/MockClassifier';
import { ResnetClassifierReal } from '../../src/services/vision/ResNetClassifier';
import { getLandmarkByName } from '../../src/data/landmarks';
import { useNavigation } from '../../src/context/NavigationContext';


// ✅ instancias separadas
const mockClassifier = new MockClassifier();
const realClassifier = new ResnetClassifierReal();
//const cameraRef = useRef<any>(null);

export default function CameraScreen() {
  //const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [permission] = useCameraPermissions();
  const [classification, setClassification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDetectedLandmark } = useNavigation();

  // ✅ BOTÓN 1: mock
  const handleMock = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setClassification(null);

    try {
      const result = await mockClassifier.classify();
      setClassification(result);

      if (result.confidence < 0.5) {
        setErrorMsg('Simulación: baja confianza');
      }

    } catch {
      setErrorMsg('Error en simulación');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ BOTÓN 2: modelo real
const handleReal = async () => {
  if (!cameraRef.current) return;

  setIsLoading(true);
  setErrorMsg(null);
  setClassification(null);

  try {
    // ✅ 1. capturar imagen
    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.7,
      skipProcessing: true,
    });

    // ✅ 2. enviar a TorchScript
    const result = await realClassifier.classify({
      uri: photo.uri,
      base64: photo.base64, // 🔥 importante
    });

    setClassification(result);

    if (result.confidence < 0.5) {
      setErrorMsg('Modelo real: baja confianza');
    }

  } catch (e) {
    console.error(e);
    setErrorMsg('Error en inferencia real');
  } finally {
    setIsLoading(false);
  }
};

  // navegación
  const handleNavigate = () => {
    if (!classification || classification.confidence < 0.5) return;

    const landmark = getLandmarkByName(classification.landmark);

    if (landmark) {
      setDetectedLandmark(landmark);
      router.push('/navigation');
    }
  };

  const isPermissionGranted = permission?.granted;

  const showNavigate =
    classification && classification.confidence >= 0.5;

  // -----------------------
  // 📱 FALLBACK SIN CÁMARA
  // -----------------------
  if (!isPermissionGranted) {
    return (
      <View style={[styles.fallbackContainer, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Modo Clasificación</Text>

        <Text style={styles.subtitle}>
          Puedes usar mock o modelo real sin cámara
        </Text>

        {/* ✅ BOTONES */}
        <Pressable style={styles.button} onPress={handleMock}>
          <LinearGradient colors={Gradients.primaryButton} style={styles.gradient}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Simulación (Mock)</Text>}
          </LinearGradient>
        </Pressable>

        <Pressable style={styles.button} onPress={handleReal}>
          <View style={styles.realButton}>
            {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.realText}>Modelo Real (.pt)</Text>}
          </View>
        </Pressable>

        {/* RESULTADO */}
        {classification && (
          <View style={styles.result}>
            <Text style={styles.resultText}>
              {classification.landmark} ({Math.round(classification.confidence * 100)}%)
            </Text>

            {showNavigate && (
              <Pressable style={styles.navigateButton} onPress={handleNavigate}>
                <Text style={styles.navigateText}>Navegar</Text>
              </Pressable>
            )}
          </View>
        )}

        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    );
  }

  // -----------------------
  // 📷 CON CÁMARA
  // -----------------------
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        
        {/* BOTONES */}
        <View style={[styles.controls, { paddingBottom: insets.bottom + 80 }]}>

          <Pressable style={styles.button} onPress={handleMock}>
            <LinearGradient colors={Gradients.primaryButton} style={styles.gradient}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Simulación</Text>}
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.button} onPress={handleReal}>
            <View style={styles.realButton}>
              {isLoading ? <ActivityIndicator color="#000" /> : <Text style={styles.realText}>Modelo Real</Text>}
            </View>
          </Pressable>

          {/* RESULTADO */}
          {classification && (
            <Text style={styles.overlayText}>
              {classification.landmark} ({Math.round(classification.confidence * 100)}%)
            </Text>
          )}

          {showNavigate && (
            <Pressable style={styles.navigateButton} onPress={handleNavigate}>
              <Text style={styles.navigateText}>Navegar</Text>
            </Pressable>
          )}
        </View>
      </CameraView>
    </View>
  );
}

// -----------------------
// ESTILOS
// -----------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },

  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: Spacing.lg,
    gap: Spacing.md,
  },

  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },

  gradient: {
    padding: 14,
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontWeight: '700',
  },

  realButton: {
    backgroundColor: Colors.accentGold,
    padding: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },

  realText: {
    color: Colors.darkGray,
    fontWeight: '700',
  },

  overlayText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 8,
  },

  navigateButton: {
    backgroundColor: Colors.primaryRed,
    padding: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },

  navigateText: {
    color: 'white',
    fontWeight: '700',
  },

  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { marginBottom: 20 },

  result: { marginTop: 20 },
  resultText: { fontSize: 16 },

  error: { color: 'red', marginTop: 10 },
});
