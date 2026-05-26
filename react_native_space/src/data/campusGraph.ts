import { landmarks } from './landmarks';
import { GraphEdge, CampusGraph, Landmark } from '../utils/types';

// Edge definitions with Spanish direction descriptions
// Distances in meters — mock coordinates are for 2D map rendering only
const edges: GraphEdge[] = [
  {
    from: 'Arco',
    to: 'Plazoleta Central',
    distance: 120,
    direction: 'Camina hacia el sur por el sendero principal por 120m hasta la Plazoleta Central',
    reverseDirection: 'Camina hacia el norte por el sendero principal por 120m hasta el Arco',
  },
  {
    from: 'Plazoleta Central',
    to: 'Aulas 1',
    distance: 80,
    direction: 'Gira a la izquierda y camina 80m hasta Aulas 1',
    reverseDirection: 'Camina hacia el norte por 80m hasta la Plazoleta Central',
  },
  {
    from: 'Plazoleta Central',
    to: 'Aulas 2',
    distance: 150,
    direction: 'Gira a la derecha y camina 150m hasta Aulas 2',
    reverseDirection: 'Camina hacia la izquierda por 150m hasta la Plazoleta Central',
  },
  {
    from: 'Plazoleta Central',
    to: 'Biblioteca',
    distance: 100,
    direction: 'Continúa recto hacia el sur por 100m hasta la Biblioteca',
    reverseDirection: 'Camina hacia el norte por 100m hasta la Plazoleta Central',
  },
  {
    from: 'Plazoleta Central',
    to: 'Lago',
    distance: 90,
    direction: 'Gira a la derecha y camina 90m hasta el Lago',
    reverseDirection: 'Camina hacia la izquierda por 90m hasta la Plazoleta Central',
  },
  {
    from: 'Aulas 1',
    to: 'Sótano 1',
    distance: 70,
    direction: 'Baja las escaleras y camina 70m hasta el Sótano 1',
    reverseDirection: 'Sube las escaleras y camina 70m hasta Aulas 1',
  },
  {
    from: 'Aulas 1',
    to: 'Biblioteca',
    distance: 60,
    direction: 'Camina hacia la derecha por 60m hasta la Biblioteca',
    reverseDirection: 'Camina hacia la izquierda por 60m hasta Aulas 1',
  },
  {
    from: 'Aulas 2',
    to: 'Lago',
    distance: 85,
    direction: 'Camina hacia el norte por 85m hasta el Lago',
    reverseDirection: 'Camina hacia el sur por 85m hasta Aulas 2',
  },
  {
    from: 'Aulas 2',
    to: 'Aulas_3',
    distance: 110,
    direction: 'Continúa hacia el sur por 110m hasta Aulas 3',
    reverseDirection: 'Camina hacia el norte por 110m hasta Aulas 2',
  },
  {
    from: 'Biblioteca',
    to: 'Sótano 2',
    distance: 95,
    direction: 'Baja por el pasillo sur por 95m hasta el Sótano 2',
    reverseDirection: 'Sube por el pasillo norte por 95m hasta la Biblioteca',
  },
  {
    from: 'Biblioteca',
    to: 'Aulas 3',
    distance: 130,
    direction: 'Camina hacia el este por 130m hasta Aulas 3',
    reverseDirection: 'Camina hacia el oeste por 130m hasta la Biblioteca',
  },
  {
    from: 'Sótano 1',
    to: 'Sótano 2',
    distance: 50,
    direction: 'Camina por el corredor subterráneo por 50m hasta el Sótano 2',
    reverseDirection: 'Camina por el corredor subterráneo por 50m hasta el Sótano 1',
  },
  {
    from: 'Lago',
    to: 'Aulas 3',
    distance: 100,
    direction: 'Camina bordeando el lago hacia el sur por 100m hasta Aulas 3',
    reverseDirection: 'Camina bordeando el lago hacia el norte por 100m hasta el Lago',
  },
];

export function buildCampusGraph(): CampusGraph {
  const nodes = new Map<string, Landmark>();
  for (const landmark of landmarks ?? []) {
    nodes.set(landmark?.name ?? '', landmark);
  }

  const adjacencyList = new Map<string, { nodeId: string; distance: number; direction: string }[]>();

  // Initialize adjacency list for all nodes
  for (const landmark of landmarks ?? []) {
    adjacencyList.set(landmark?.name ?? '', []);
  }

  // Add edges (undirected)
  for (const edge of edges ?? []) {
    const fromList = adjacencyList.get(edge?.from ?? '');
    const toList = adjacencyList.get(edge?.to ?? '');

    fromList?.push({
      nodeId: edge?.to ?? '',
      distance: edge?.distance ?? 0,
      direction: edge?.direction ?? '',
    });

    toList?.push({
      nodeId: edge?.from ?? '',
      distance: edge?.distance ?? 0,
      direction: edge?.reverseDirection ?? '',
    });
  }

  return { nodes, adjacencyList };
}

export { edges };
