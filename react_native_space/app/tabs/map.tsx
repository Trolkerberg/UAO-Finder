import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CampusMapView from '../../src/components/CampusMapView';
import { useNavigation } from '../../src/context/NavigationContext';
import { Colors, Spacing, BorderRadius } from '../../src/utils/constants';
import { Landmark } from '../../src/utils/types';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { computedRoute, clearNavigation, setSelectedDestination, detectedLandmark } = useNavigation();
  const [selectedLandmark, setSelectedLandmark] = React.useState<Landmark | null>(null);

  const handleLandmarkPress = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.headerTitle}>Mapa del Campus</Text>
        <View style={styles.headerAccent} />
      </View>

      {/* Map */}
      <CampusMapView
        route={computedRoute}
        onLandmarkPress={handleLandmarkPress}
        style={styles.map}
        interactive
      />

      {/* Route info card */}
      {computedRoute && (
        <View style={styles.routeCard}>
          <Text style={styles.routeText}>
            Desde: {computedRoute?.path?.[0] ?? ''} \u2192 Hasta:{' '}
            {computedRoute?.path?.[(computedRoute?.path?.length ?? 1) - 1] ?? ''}
          </Text>
          <Text style={styles.routeDetail}>
            {computedRoute?.totalDistance ?? 0}m \u00b7 {computedRoute?.estimatedTime ?? 0} min
          </Text>
          <Pressable
            onPress={clearNavigation}
            style={styles.clearButton}
            accessibilityLabel="Limpiar ruta"
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>Limpiar ruta</Text>
          </Pressable>
        </View>
      )}

      {/* Selected landmark info */}
      {selectedLandmark && !computedRoute && (
        <View style={styles.landmarkCard}>
          <Text style={styles.landmarkName}>{selectedLandmark?.name ?? ''}</Text>
          <Text style={styles.landmarkDesc}>{selectedLandmark?.description ?? ''}</Text>
          {!selectedLandmark?.isWaypoint && (
            <Pressable
              style={({ pressed }) => [styles.navButton, pressed && { opacity: 0.8 }]}
              onPress={() => {
                setSelectedDestination(selectedLandmark);
                setSelectedLandmark(null);
              }}
              accessibilityLabel={`Navegar hasta ${selectedLandmark?.name ?? ''}`}
              accessibilityRole="button"
            >
              <Text style={styles.navButtonText}>Navegar hasta aqu\u00ed</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Legend when no route */}
      {!computedRoute && !selectedLandmark && (
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: Colors.primaryRed }]} />
            <Text style={styles.legendText}>Puntos de inter\u00e9s</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#999' }]} />
            <Text style={styles.legendText}>Puntos intermedios</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerAccent: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primaryRed,
    borderRadius: 2,
    marginTop: 6,
  },
  map: {
    flex: 1,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  routeCard: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  routeDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  clearButton: {
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: Colors.primaryRed,
    fontWeight: '600',
    fontSize: 14,
  },
  landmarkCard: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  landmarkName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  landmarkDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  navButton: {
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    alignSelf: 'flex-start',
  },
  navButtonText: {
    color: Colors.darkGray,
    fontWeight: '700',
    fontSize: 14,
  },
  legend: {
    position: 'absolute',
    bottom: Spacing.base,
    left: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
