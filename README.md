# 🎯 UAO Finder

### Sistema de Navegación Inteligente para el Campus Universitario

![Build Status](https://img.shields.io/badge/APK%20build-bloqueado%20por%20PyTorch-red)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

**UAO Finder** es una aplicación móvil desarrollada para la **Universidad Autónoma de Occidente (UAO)** en Cali, Colombia. Utiliza visión por computadora y algoritmos de búsqueda de ruta más corta para ayudar a estudiantes nuevos a orientarse dentro del campus universitario.

## ✨ Características

- 📷 **Detección de Puntos de Referencia** — Sistema de visión por computadora basado en ResNet18 entrenado con imágenes del campus de la UAO para identificar ubicaciones en tiempo real
- 🗺️ **Mapa Interactivo SVG** — Mapa 2D del campus con zoom, paneo y visualización de rutas
- 🧭 **Navegación por Ruta Más Corta** — Algoritmo de Dijkstra implementado en TypeScript puro para calcular la ruta óptima entre ubicaciones
- 📍 **Instrucciones Paso a Paso** — Direcciones detalladas en español con distancias y tiempos estimados
- 🔍 **Búsqueda de Destinos** — Exploración filtrable de los 6 puntos de referencia del campus
- 📱 **Diseño Nativo** — Interfaz siguiendo Apple HIG y Material Design con los colores institucionales de la UAO

## 📸 Capturas de Pantalla

| Cámara | Mapa | Destinos | Navegación |
|--------|------|----------|------------|
| ![Cámara](docs/screenshots/camera.png) | ![Mapa](docs/screenshots/map.png) | ![Destinos](docs/screenshots/destinations.png) | ![Navegación](docs/screenshots/navigation.png) |

> *Las capturas de pantalla se agregarán próximamente.*

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- Expo CLI
- Yarn

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/Trolkerberg/UAO-Finder.git
cd UAO-Finder

# Instalar dependencias
cd react_native_space
yarn install

# Iniciar servidor de desarrollo
npx expo start
```

Escanea el código QR con **Expo Go** (Android) o la app de Cámara (iOS) para probar en tu dispositivo.

## ⚠️ Estado de la Versión Actual

La versión presente corresponde a la **última versión disponible en GitHub**. En este estado, el proyecto **no permite construir el APK final** debido a errores relacionados con la integración de **PyTorch** en el entorno móvil.

El **APK incluido en la carpeta del proyecto** representa una **versión de prueba**. Esta versión no usa modelos de inteligencia artificial reales, sino que **simula la interacción de reconocimiento y navegación** para validar el flujo de uso de la aplicación.

## 📂 Estructura del Proyecto

```
react_native_space/
├── app/                          # Expo Router - Pantallas y navegación
│   ├── _layout.tsx               # Layout raíz (carga fuentes, contexto)
│   ├── index.tsx                 # Redirección a tabs
│   ├── +not-found.tsx            # Pantalla 404
│   ├── tabs/                     # Navegación por pestañas
│   │   ├── _layout.tsx           # Configuración de tabs
│   │   ├── camera.tsx            # Pantalla de cámara/detección
│   │   ├── map.tsx               # Mapa interactivo del campus
│   │   ├── destinations.tsx      # Lista de destinos
│   │   └── info.tsx              # Información de la app
│   └── navigation/
│       └── index.tsx             # Pantalla de navegación con ruta
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── CampusMapView.tsx     # Mapa SVG del campus
│   │   ├── DetectionOverlay.tsx  # Overlay de detección
│   │   ├── LandmarkCard.tsx      # Tarjeta de destino
│   │   ├── RouteSteps.tsx        # Pasos de navegación
│   │   ├── SearchBar.tsx         # Barra de búsqueda
│   │   └── ErrorBoundary.tsx     # Manejo de errores
│   ├── context/
│   │   └── NavigationContext.tsx # Estado global de navegación
│   ├── data/
│   │   ├── campusGraph.ts        # Grafo del campus (nodos + aristas)
│   │   └── landmarks.ts         # Definiciones de puntos de referencia
│   ├── services/
│   │   ├── pathfinding/
│   │   │   └── dijkstra.ts       # Algoritmo de Dijkstra
│   │   └── vision/
│   │       ├── types.ts          # Interfaz IVisionDetector
│   │       ├── MockDetector.ts   # Detector simulado
│   │       └── factory.ts        # Factory para intercambiar detectores
│   └── utils/
│       ├── constants.ts          # Colores UAO, espaciado, fuentes
│       └── types.ts              # Tipos TypeScript compartidos
└── docs/                         # Documentación del proyecto
```

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React Native** | Framework de desarrollo móvil multiplataforma |
| **Expo (SDK 54)** | Plataforma de desarrollo y distribución |
| **TypeScript** | Tipado estático para código robusto |
| **Expo Router** | Navegación basada en archivos |
| **react-native-svg** | Renderizado del mapa SVG interactivo |
| **ResNet18** | Modelo entrenado con imágenes del campus de la UAO para reconocimiento de puntos de referencia |
| **Dijkstra** | Algoritmo de ruta más corta en grafo ponderado |

## 📊 Dataset

El modelo de reconocimiento basado en **ResNet18** fue entrenado con un dataset personalizado:

- **1,236+ imágenes** capturadas en el campus de la UAO
- **6 clases** de puntos de referencia:
  - 🏛️ Arco (entrada principal)
  - 🏫 Aulas 1 (primer bloque académico)
  - 🏫 Aulas 2 (segundo bloque académico)
  - 🏫 Aulas 3 (tercer bloque académico)
  - 🔽 Sótano 1 (nivel subterráneo 1)
  - 🔽 Sótano 2 (nivel subterráneo 2)
- **Formato**: PASCAL VOC / COCO
- **Disponibilidad**: [Kaggle](https://kaggle.com) / [Google Drive](https://drive.google.com)

## 📐 Metodología

### Reconocimiento de Puntos de Referencia

Se emplea un modelo **ResNet18** entrenado con imágenes capturadas en el campus de la UAO para reconocer puntos de referencia y apoyar la ubicación inicial del usuario dentro de la aplicación.

1. **Preprocesamiento**: ajuste del tamaño de imagen, normalización y preparación del frame capturado por la cámara.
2. **Extracción de características**: uso de la arquitectura ResNet18 para obtener patrones visuales representativos de cada punto del campus.
3. **Clasificación**: predicción del punto de referencia más probable según las clases entrenadas.
4. **Integración con navegación**: el resultado del reconocimiento se usa como punto de partida para calcular rutas dentro del mapa.

En la versión de prueba incluida como APK, la interacción se simula y no se ejecuta un modelo real en el dispositivo.

### Navegación por Ruta Más Corta

El campus se modela como un **grafo ponderado no dirigido** con:
- **9 nodos**: 6 puntos de referencia + 3 puntos intermedios
- **13 aristas**: conexiones peatonales con distancias en metros

El **algoritmo de Dijkstra** calcula la ruta óptima y genera instrucciones paso a paso en español, incluyendo distancia total y tiempo estimado de caminata (80m/min).

## 📚 Benchmarks de Referencia

### UVManos
Proyecto de reconocimiento de gestos de manos desarrollado en la **Universidad del Valle** (Cali, Colombia). Sirvió como referencia metodológica para el pipeline de visión por computadora aplicado al reconocimiento de puntos de referencia en campus universitarios.

### Mcity
Instalación de prueba de vehículos autónomos en la **University of Michigan**. Inspiró el enfoque de navegación a escala campus, combinando percepción visual con algoritmos de búsqueda de caminos en un entorno controlado.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Para contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu feature: `git checkout -b feature/mi-mejora`
3. Haz commit de tus cambios: `git commit -m 'Agregar mi mejora'`
4. Sube la rama: `git push origin feature/mi-mejora`
5. Abre un Pull Request

Por favor, asegúrate de que tu código sigue las convenciones de estilo del proyecto y pasa todas las pruebas.

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** — ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores y Créditos

- **Juan Camilo Salgado Baldion**
- **Jose Andres Criollo Echeverri**
- **Juan Felipe Fernandez Losada**
- **Juan Diego Parra Patiño**
- **Universidad Autónoma de Occidente** — Institución académica, Cali, Colombia

---

<p align="center">
  <strong>UAO Finder</strong> · Universidad Autónoma de Occidente · Cali, Colombia 🇨🇴
</p>
