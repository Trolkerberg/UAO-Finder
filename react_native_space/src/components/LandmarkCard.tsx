import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '../utils/constants';
import { Landmark } from '../utils/types';

interface LandmarkCardProps {
  landmark: Landmark;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function LandmarkCard({ landmark, onPress, style }: LandmarkCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityLabel={`Destino: ${landmark?.name ?? ''}`}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={(landmark?.icon as keyof typeof MaterialCommunityIcons.glyphMap) ?? 'map-marker'}
          size={32}
          color={Colors.primaryRed}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {landmark?.name ?? ''}
      </Text>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{landmark?.category ?? ''}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {landmark?.description ?? ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FDE8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
