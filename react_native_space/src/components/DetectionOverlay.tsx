import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DetectionResult } from '../utils/types';
import { Colors, BorderRadius, Spacing } from '../utils/constants';

interface DetectionOverlayProps {
  detection: DetectionResult | null;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return Colors.success;
  if (confidence >= 0.4) return Colors.accentGold;
  return Colors.error;
}

export default function DetectionOverlay({ detection }: DetectionOverlayProps) {
  if (!detection) return null;

  const confidencePercent = Math.round((detection?.confidence ?? 0) * 100);
  const confColor = getConfidenceColor(detection?.confidence ?? 0);

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.landmarkName}>{detection?.landmark ?? 'Desconocido'}</Text>
        <View style={[styles.confidenceBadge, { backgroundColor: confColor }]}>
          <Text style={styles.confidenceText}>{confidencePercent}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 60,
    paddingHorizontal: Spacing.base,
  },
  overlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  landmarkName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
  },
  confidenceBadge: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginLeft: Spacing.sm,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
