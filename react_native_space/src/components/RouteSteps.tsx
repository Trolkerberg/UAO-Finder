import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { DirectionStep } from '../utils/types';
import { Colors, Spacing, BorderRadius } from '../utils/constants';

interface RouteStepsProps {
  steps: DirectionStep[];
  style?: StyleProp<ViewStyle>;
}

export default function RouteSteps({ steps, style }: RouteStepsProps) {
  const safeSteps = steps ?? [];

  if (safeSteps.length === 0) return null;

  return (
    <View style={[styles.container, style]}>
      {safeSteps.map((step, index) => (
        <View key={`step-${index}`} style={styles.stepRow}>
          {/* Vertical stepper line */}
          <View style={styles.stepperColumn}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            {index < safeSteps.length - 1 && <View style={styles.verticalLine} />}
          </View>

          {/* Step content */}
          <View style={styles.stepContent}>
            <Text style={styles.directionText}>{step?.direction ?? ''}</Text>
            <Text style={styles.distanceText}>{step?.distance ?? 0}m</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 70,
  },
  stepperColumn: {
    alignItems: 'center',
    width: 40,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.primaryRed,
    opacity: 0.3,
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.base,
  },
  directionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
