export interface Landmark {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string; // MaterialCommunityIcons name
  x: number; // Mock map coordinate
  y: number;
  isWaypoint: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  distance: number; // meters
  direction: string; // Spanish direction text
  reverseDirection: string; // Spanish direction text for reverse traversal
}

export interface CampusGraph {
  nodes: Map<string, Landmark>;
  adjacencyList: Map<string, { nodeId: string; distance: number; direction: string }[]>;
}

export interface DirectionStep {
  from: string;
  to: string;
  distance: number;
  direction: string;
}

export interface RouteResult {
  path: string[];
  totalDistance: number;
  estimatedTime: number; // minutes
  steps: DirectionStep[];
}

export interface DetectionResult {
  landmark: string;
  confidence: number;
  boundingBox: { x: number; y: number; w: number; h: number };
  timestamp: number;
}
