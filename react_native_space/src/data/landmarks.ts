import { Landmark } from '../utils/types';

export const landmarks: Landmark[] = [
  {
    id: 'arco',
    name: 'Arco',
    category: 'Punto de Referencia',
    description: 'Entrada principal de la universidad, punto de encuentro estudiantil',
    icon: 'gate',
    x: 150,
    y: 50,
    isWaypoint: false,
  },
  {
    id: 'plazoleta_central',
    name: 'Plazoleta Central',
    category: 'Punto de Referencia',
    description: 'Plaza central del campus, nodo principal de conexión',
    icon: 'compass',
    x: 300,
    y: 200,
    isWaypoint: true,
  },
  {
    id: 'aulas_1',
    name: 'Aulas 1',
    category: 'Edificio Académico',
    description: 'Primer bloque de aulas para clases magistrales y seminarios',
    icon: 'school',
    x: 150,
    y: 300,
    isWaypoint: false,
  },
  {
    id: 'aulas_2',
    name: 'Aulas 2',
    category: 'Edificio Académico',
    description: 'Segundo bloque de aulas con laboratorios y salas de estudio',
    icon: 'school',
    x: 450,
    y: 300,
    isWaypoint: false,
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    category: 'Servicios',
    description: 'Biblioteca central con recursos académicos y espacios de estudio',
    icon: 'book-open-variant',
    x: 300,
    y: 350,
    isWaypoint: true,
  },
  {
    id: 'lago',
    name: 'Lago',
    category: 'Punto de Referencia',
    description: 'Lago ornamental del campus, zona de descanso y esparcimiento',
    icon: 'water',
    x: 450,
    y: 150,
    isWaypoint: true,
  },
  {
    id: 'sotano_1',
    name: 'Sótano 1',
    category: 'Edificio Académico',
    description: 'Nivel subterráneo con aulas adicionales y espacios de trabajo',
    icon: 'stairs-down',
    x: 100,
    y: 450,
    isWaypoint: false,
  },
  {
    id: 'sotano_2',
    name: 'Sótano 2',
    category: 'Edificio Académico',
    description: 'Segundo nivel subterráneo con laboratorios especializados',
    icon: 'stairs-down',
    x: 200,
    y: 500,
    isWaypoint: false,
  },
  {
    id: 'aulas_3',
    name: 'Aulas_3',
    category: 'Edificio Académico',
    description: 'Tercer bloque académico para clases y actividades universitarias',
    icon: 'school',
    x: 500,
    y: 450,
    isWaypoint: false,
  },
];

export const detectableLandmarks = landmarks.filter((l) => !l?.isWaypoint);

export function getLandmarkById(id: string): Landmark | undefined {
  return landmarks?.find((l) => l?.id === id);
}

export function getLandmarkByName(name: string): Landmark | undefined {
  return landmarks?.find((l) => l?.name === name);
}
