import { CampusGraph, RouteResult, DirectionStep } from '../../utils/types';
import { WALKING_SPEED_M_PER_MIN } from '../../utils/constants';

/**
 * Dijkstra's shortest path algorithm — pure TypeScript implementation.
 * Finds the shortest path between two nodes in the campus graph.
 */
export function dijkstra(
  graph: CampusGraph,
  startNode: string,
  endNode: string
): RouteResult | null {
  if (!graph?.adjacencyList || !startNode || !endNode) return null;
  if (startNode === endNode) return null;

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();
  const unvisited: string[] = [];

  // Initialize distances
  for (const nodeId of graph.adjacencyList.keys()) {
    distances.set(nodeId, nodeId === startNode ? 0 : Infinity);
    previous.set(nodeId, null);
    unvisited.push(nodeId);
  }

  while (unvisited.length > 0) {
    // Find unvisited node with minimum distance
    let minDist = Infinity;
    let current: string | null = null;

    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId) ?? Infinity;
      if (!visited.has(nodeId) && dist < minDist) {
        minDist = dist;
        current = nodeId;
      }
    }

    if (current === null || minDist === Infinity) break;
    if (current === endNode) break;

    visited.add(current);
    const idx = unvisited.indexOf(current);
    if (idx > -1) unvisited.splice(idx, 1);

    // Relax neighbors
    const neighbors = graph.adjacencyList.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor?.nodeId ?? '')) continue;

      const newDist = (distances.get(current) ?? Infinity) + (neighbor?.distance ?? 0);
      if (newDist < (distances.get(neighbor?.nodeId ?? '') ?? Infinity)) {
        distances.set(neighbor?.nodeId ?? '', newDist);
        previous.set(neighbor?.nodeId ?? '', current);
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let node: string | null | undefined = endNode;

  while (node) {
    path.unshift(node);
    node = previous.get(node) ?? null;
  }

  if (path?.[0] !== startNode) {
    return null; // No path found
  }

  // Build direction steps
  const steps: DirectionStep[] = [];
  for (let i = 0; i < (path?.length ?? 0) - 1; i++) {
    const from = path?.[i] ?? '';
    const to = path?.[i + 1] ?? '';
    const neighbors = graph.adjacencyList.get(from) ?? [];
    const edge = neighbors.find((n) => n?.nodeId === to);

    steps.push({
      from,
      to,
      distance: edge?.distance ?? 0,
      direction: edge?.direction ?? `Camina hasta ${to}`,
    });
  }

  const totalDistance = distances.get(endNode) ?? 0;
  const estimatedTime = Math.ceil(totalDistance / WALKING_SPEED_M_PER_MIN);

  return {
    path,
    totalDistance,
    estimatedTime,
    steps,
  };
}
