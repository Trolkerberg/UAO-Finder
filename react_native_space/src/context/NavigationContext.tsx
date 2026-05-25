import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Landmark, RouteResult } from '../utils/types';
import { buildCampusGraph } from '../data/campusGraph';
import { dijkstra } from '../services/pathfinding/dijkstra';

interface NavigationContextType {
  detectedLandmark: Landmark | null;
  selectedDestination: Landmark | null;
  computedRoute: RouteResult | null;
  setDetectedLandmark: (landmark: Landmark | null) => void;
  setSelectedDestination: (landmark: Landmark | null) => void;
  computeRoute: (fromName: string, toName: string) => RouteResult | null;
  clearNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [detectedLandmark, setDetectedLandmark] = useState<Landmark | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Landmark | null>(null);
  const [computedRoute, setComputedRoute] = useState<RouteResult | null>(null);

  const graph = useMemo(() => buildCampusGraph(), []);

  const computeRoute = useCallback(
    (fromName: string, toName: string): RouteResult | null => {
      if (!fromName || !toName) return null;
      const result = dijkstra(graph, fromName, toName);
      setComputedRoute(result);
      return result;
    },
    [graph]
  );

  const clearNavigation = useCallback(() => {
    setDetectedLandmark(null);
    setSelectedDestination(null);
    setComputedRoute(null);
  }, []);

  const value = useMemo(
    () => ({
      detectedLandmark,
      selectedDestination,
      computedRoute,
      setDetectedLandmark,
      setSelectedDestination,
      computeRoute,
      clearNavigation,
    }),
    [detectedLandmark, selectedDestination, computedRoute, computeRoute, clearNavigation]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextType {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}
