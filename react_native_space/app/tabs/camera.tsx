import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Gradients, Spacing, BorderRadius } from '../../src/utils/constants';
import { DetectionResult } from '../../src/utils/types';
import { createVisionDetector } from '../../src/services/vision/factory';
import { getLandmarkByName } from '../../src/data/landmarks';
import { useNavigation } from '../../src/context/NavigationContext';
import DetectionOverlay from '../../src/components/DetectionOverlay';

const detector = createVisionDetector();

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detection, setDetection] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setDetectedLandmark } = useNavigation();

  const handleSimulateDetection = async () => {
    setIsDetecting(true);
    setErrorMsg(null);
    setDetection(null);

    try {
      const result = await detector.detect();
      setDetection(result);

      if ((result?.confidence ?? 0) < 0.5) {
        setErrorMsg('No se pudo reconocer la ubicaci\u00f3n');
        setTimeout(() => setErrorMsg(null), 3000);
      }
    } catch (e) {
      setErrorMsg('Error al procesar la imagen');
      setTimeout(() => setErrorMsg(null), 3000);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleNavigate = () => {
    if (!detection || (detection?.confidence ?? 0) < 0.5) return;
    const landmark = getLandmarkByName(detection?.landmark ?? '');
    if (landmark) {
      setDetectedLandmark(landmark);
      router.push('/navigation');
    }
  };

  const isPermissionGranted = permission?.granted;
  const showNavigateButton = detection && (detection?.confidence ?? 0) >= 0.5;

  // Camera not available on web or permission denied
  if (!isPermissionGranted) {
    return (
      <View style={[styles.fallbackContainer, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons name="camera-off" size={80} color={Colors.inactive} />
        <Text style={styles.fallbackTitle}>Acceso a la C\u00e1mara</Text>
        <Text style={styles.fallbackText}>
          Se requiere acceso a la c\u00e1mara para detectar ubicaciones del campus.
        </Text>
        {Platform.OS !== 'web' && !permission?.granted && (
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              if (permission?.canAskAgain) {
                requestPermission();
              } else {
                Linking.openSettings();
              }
            }}
            accessibilityLabel="Solicitar permiso de c\u00e1mara"
            accessibilityRole="button"
          >
            <Text style={styles.settingsButtonText}>
              {permission?.canAskAgain ? 'Permitir C\u00e1mara' : 'Abrir Configuraci\u00f3n'}
            </Text>
          </Pressable>
        )}

        {/* Still allow simulation without camera */}
        <View style={styles.simulateSection}>
          <Text style={styles.simulateHint}>Puedes usar la simulaci\u00f3n sin c\u00e1mara:</Text>
          <Pressable
            style={({ pressed }) => [styles.simulateButton, pressed && styles.buttonPressed]}
            onPress={handleSimulateDetection}
            disabled={isDetecting}
            accessibilityLabel="Simular detecci\u00f3n"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={Gradients.primaryButton}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isDetecting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Simular Detecci\u00f3n</Text>
              )}
            </LinearGradient>
          </Pressable>

          {detection && (
            <View style={styles.fallbackDetection}>
              <Text style={styles.detectedLabel}>
                Detectado: {detection?.landmark ?? ''} ({Math.round((detection?.confidence ?? 0) * 100)}%)
              </Text>
              {showNavigateButton && (
                <Pressable
                  style={({ pressed }) => [styles.navigateButton, pressed && styles.buttonPressed]}
                  onPress={handleNavigate}
                  accessibilityLabel="Navegar desde aqu\u00ed"
                  accessibilityRole="button"
                >
                  <Text style={styles.navigateButtonText}>Navegar desde aqu\u00ed</Text>
                </Pressable>
              )}
            </View>
          )}

          {errorMsg && (
            <View style={styles.errorToast}>
              <Text style={styles.errorToastText}>{errorMsg}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <DetectionOverlay detection={detection} />

        {/* Error toast */}
        {errorMsg && (
          <View style={[styles.errorToast, styles.errorToastCamera]}>
            <Text style={styles.errorToastText}>{errorMsg}</Text>
          </View>
        )}

        {/* Bottom controls */}
        <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 80 }]}>
          <Pressable
            style={({ pressed }) => [styles.simulateButton, pressed && styles.buttonPressed]}
            onPress={handleSimulateDetection}
            disabled={isDetecting}
            accessibilityLabel="Simular detecci\u00f3n"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={Gradients.primaryButton}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isDetecting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Simular Detecci\u00f3n</Text>
              )}
            </LinearGradient>
          </Pressable>

          {showNavigateButton && (
            <Pressable
              style={({ pressed }) => [styles.navigateButton, pressed && styles.buttonPressed]}
              onPress={handleNavigate}
              accessibilityLabel="Navegar desde aqu\u00ed"
              accessibilityRole="button"
            >
              <Text style={styles.navigateButtonText}>Navegar desde aqu\u00ed</Text>
            </Pressable>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  simulateButton: {
    width: '100%',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  navigateButton: {
    width: '100%',
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: Colors.darkGray,
    fontSize: 17,
    fontWeight: '700',
  },
  errorToast: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.md,
    alignSelf: 'center',
  },
  errorToastCamera: {
    position: 'absolute',
    bottom: 200,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  errorToastText: {
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
  // Fallback (no camera)
  fallbackContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  fallbackText: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  settingsButton: {
    backgroundColor: Colors.primaryRed,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  settingsButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  simulateSection: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  simulateHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  fallbackDetection: {
    alignItems: 'center',
    marginTop: Spacing.base,
  },
  detectedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
});
