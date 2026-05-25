import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '../../src/context/NavigationContext';
import { detectableLandmarks, getLandmarkByName } from '../../src/data/landmarks';
import CampusMapView from '../../src/components/CampusMapView';
import RouteSteps from '../../src/components/RouteSteps';
import { Colors, Gradients, Spacing, BorderRadius } from '../../src/utils/constants';
import { RouteResult } from '../../src/utils/types';

export default function NavigationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    detectedLandmark,
    selectedDestination,
    computeRoute,
    computedRoute,
  } = useNavigation();

  const [originName, setOriginName] = useState<string>(detectedLandmark?.name ?? '');
  const [destName, setDestName] = useState<string>(selectedDestination?.name ?? '');
  const [localRoute, setLocalRoute] = useState<RouteResult | null>(computedRoute);
  const [error, setError] = useState<string | null>(null);

  // Sync from context on mount
  useEffect(() => {
    if (detectedLandmark?.name) setOriginName(detectedLandmark.name);
  }, [detectedLandmark?.name]);

  useEffect(() => {
    if (selectedDestination?.name) setDestName(selectedDestination.name);
  }, [selectedDestination?.name]);

  const landmarkOptions = useMemo(() => detectableLandmarks ?? [], []);

  const handleCalculateRoute = () => {
    setError(null);
    if (!originName || !destName) {
      setError('Selecciona un origen y un destino');
      return;
    }
    if (originName === destName) {
      setError('El origen y destino son iguales');
      return;
    }
    const result = computeRoute(originName, destName);
    if (!result) {
      setError('No se encontr\u00f3 una ruta disponible');
    }
    setLocalRoute(result);
  };

  const route = localRoute ?? computedRoute;

  const handleViewOnMap = () => {
    // Navigate to map tab — route is already in context via computeRoute
    router.replace('/tabs/map');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Origin & Destination Selectors */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorLabel}>Desde:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={originName}
            onValueChange={(val) => setOriginName(val)}
            style={styles.picker}
            accessibilityLabel="Seleccionar origen"
          >
            <Picker.Item label="Seleccionar origen..." value="" />
            {(landmarkOptions).map((lm) => (
              <Picker.Item
                key={lm?.id ?? ''}
                label={lm?.name ?? ''}
                value={lm?.name ?? ''}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.arrowRow}>
          <MaterialCommunityIcons name="arrow-down" size={24} color={Colors.primaryRed} />
        </View>

        <Text style={styles.selectorLabel}>Hasta:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={destName}
            onValueChange={(val) => setDestName(val)}
            style={styles.picker}
            accessibilityLabel="Seleccionar destino"
          >
            <Picker.Item label="Seleccionar destino..." value="" />
            {(landmarkOptions).map((lm) => (
              <Picker.Item
                key={lm?.id ?? ''}
                label={lm?.name ?? ''}
                value={lm?.name ?? ''}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Warning / Error */}
      {error && (
        <View style={styles.errorBanner}>
          <MaterialCommunityIcons name="alert-circle" size={18} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Calculate Button */}
      <Pressable
        style={({ pressed }) => [styles.calcButton, pressed && { transform: [{ scale: 0.97 }] }]}
        onPress={handleCalculateRoute}
        accessibilityLabel="Calcular ruta"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={Gradients.primaryButton}
          style={styles.calcGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calcButtonText}>Calcular Ruta</Text>
        </LinearGradient>
      </Pressable>

      {/* Route Results */}
      {route && (
        <>
          {/* Mini map */}
          <View style={styles.miniMapContainer}>
            <CampusMapView route={route} interactive={false} style={styles.miniMap} />
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="map-marker-distance" size={22} color={Colors.primaryRed} />
                <Text style={styles.summaryValue}>{route?.totalDistance ?? 0}m</Text>
                <Text style={styles.summaryLabel}>Distancia</Text>
              </View>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="clock-outline" size={22} color={Colors.primaryRed} />
                <Text style={styles.summaryValue}>{route?.estimatedTime ?? 0} min</Text>
                <Text style={styles.summaryLabel}>Tiempo est.</Text>
              </View>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="walk" size={22} color={Colors.primaryRed} />
                <Text style={styles.summaryValue}>{route?.steps?.length ?? 0}</Text>
                <Text style={styles.summaryLabel}>Pasos</Text>
              </View>
            </View>
          </View>

          {/* Step-by-step */}
          <View style={styles.stepsCard}>
            <Text style={styles.stepsTitle}>Instrucciones</Text>
            <RouteSteps steps={route?.steps ?? []} />
          </View>

          {/* View on map button */}
          <Pressable
            style={({ pressed }) => [styles.mapButton, pressed && { opacity: 0.8 }]}
            onPress={handleViewOnMap}
            accessibilityLabel="Ver en mapa"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="map" size={20} color={Colors.darkGray} />
            <Text style={styles.mapButtonText}>Ver en Mapa</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
  },
  selectorCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: Spacing.md,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
    color: Colors.textPrimary,
  },
  arrowRow: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
    flex: 1,
  },
  calcButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  calcGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  calcButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  miniMapContainer: {
    height: 220,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  miniMap: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: Spacing.md,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  mapButtonText: {
    color: Colors.darkGray,
    fontSize: 17,
    fontWeight: '700',
  },
});
