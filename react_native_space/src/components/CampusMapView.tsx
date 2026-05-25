import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Polyline, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { landmarks } from '../data/landmarks';
import { edges } from '../data/campusGraph';
import { RouteResult, Landmark } from '../utils/types';
import { Colors, BorderRadius, Spacing } from '../utils/constants';

interface CampusMapViewProps {
  route?: RouteResult | null;
  onLandmarkPress?: (landmark: Landmark) => void;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
}

const MAP_WIDTH = 620;
const MAP_HEIGHT = 580;
const PADDING = 20;

export default function CampusMapView({
  route,
  onLandmarkPress,
  style,
  interactive = true,
}: CampusMapViewProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const handleMarkerPress = (landmark: Landmark) => {
    if (!interactive) return;
    setSelectedMarker(landmark?.name ?? null);
    onLandmarkPress?.(landmark);
  };

  const routeNodes = route?.path ?? [];

  // Build route polyline points
  const routePoints = routeNodes
    .map((name) => {
      const lm = landmarks?.find((l) => l?.name === name);
      if (!lm) return null;
      return `${(lm?.x ?? 0) + PADDING},${(lm?.y ?? 0) + PADDING}`;
    })
    .filter(Boolean)
    .join(' ');

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.scrollContent}
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={interactive}
    >
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        bounces={interactive}
      >
        <Svg
          width={MAP_WIDTH + PADDING * 2}
          height={MAP_HEIGHT + PADDING * 2}
          viewBox={`0 0 ${MAP_WIDTH + PADDING * 2} ${MAP_HEIGHT + PADDING * 2}`}
        >
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={MAP_WIDTH + PADDING * 2}
            height={MAP_HEIGHT + PADDING * 2}
            fill="#F0F4F0"
            rx={12}
          />

          {/* Draw edges as dashed gray lines */}
          {(edges ?? []).map((edge, i) => {
            const from = landmarks?.find((l) => l?.name === edge?.from);
            const to = landmarks?.find((l) => l?.name === edge?.to);
            if (!from || !to) return null;
            return (
              <Line
                key={`edge-${i}`}
                x1={(from?.x ?? 0) + PADDING}
                y1={(from?.y ?? 0) + PADDING}
                x2={(to?.x ?? 0) + PADDING}
                y2={(to?.y ?? 0) + PADDING}
                stroke="#CCC"
                strokeWidth={1.5}
                strokeDasharray="6,4"
              />
            );
          })}

          {/* Draw route path */}
          {routePoints ? (
            <Polyline
              points={routePoints}
              fill="none"
              stroke={Colors.primaryRed}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {/* Draw markers */}
          {(landmarks ?? []).map((lm) => {
            const cx = (lm?.x ?? 0) + PADDING;
            const cy = (lm?.y ?? 0) + PADDING;
            const isInRoute = routeNodes?.includes(lm?.name ?? '');
            const isOrigin =
              routeNodes?.length > 0 && routeNodes?.[0] === lm?.name;
            const isDestination =
              routeNodes?.length > 0 &&
              routeNodes?.[routeNodes.length - 1] === lm?.name;
            const isSelected = selectedMarker === lm?.name;
            const isWaypoint = lm?.isWaypoint;

            let fillColor = isWaypoint ? '#999' : Colors.primaryRed;
            if (isOrigin) fillColor = Colors.success;
            if (isDestination) fillColor = Colors.accentGold;

            const radius = isWaypoint ? 7 : 12;

            return (
              <React.Fragment key={lm?.id ?? lm?.name}>
                <Circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? radius + 4 : radius}
                  fill={fillColor}
                  stroke={isInRoute ? Colors.primaryRed : '#FFF'}
                  strokeWidth={isInRoute ? 3 : 2}
                  onPress={() => handleMarkerPress(lm)}
                />
                <SvgText
                  x={cx}
                  y={cy + radius + 14}
                  textAnchor="middle"
                  fontSize={isWaypoint ? 10 : 12}
                  fontWeight={isWaypoint ? 'normal' : 'bold'}
                  fill={Colors.textPrimary}
                >
                  {lm?.name ?? ''}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F0',
    borderRadius: BorderRadius.md,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
