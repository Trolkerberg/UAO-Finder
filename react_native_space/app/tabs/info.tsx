import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../src/utils/constants';

const GITHUB_URL = 'https://github.com/Trolkerberg/UAO-Finder';

export default function InfoScreen() {
  const insets = useSafeAreaInsets();

  const openGitHub = () => {
    Linking.openURL(GITHUB_URL).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.sm, paddingBottom: insets.bottom + Spacing.xxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* App header */}
      <View style={styles.appHeader}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="map-marker-radius" size={48} color={Colors.primaryRed} />
        </View>
        <Text style={styles.appName}>UAO Finder</Text>
        <Text style={styles.version}>v1.0.0</Text>
        <Text style={styles.tagline}>Navegaci\u00f3n inteligente para el campus UAO</Text>
      </View>

      {/* About section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <Text style={styles.sectionBody}>
          UAO Finder es una aplicaci\u00f3n m\u00f3vil dise\u00f1ada para ayudar a los estudiantes nuevos de la
          Universidad Aut\u00f3noma de Occidente a orientarse dentro del campus. Mediante detecci\u00f3n
          visual de puntos de referencia y un sistema de navegaci\u00f3n por ruta m\u00e1s corta, los
          usuarios pueden encontrar f\u00e1cilmente el camino hacia cualquier ubicaci\u00f3n del campus.
        </Text>
      </View>

      {/* Methodology section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Metodolog\u00eda</Text>

        <Text style={styles.subTitle}>Detecci\u00f3n de Puntos de Referencia</Text>
        <Text style={styles.sectionBody}>
          El sistema utiliza un modelo Faster R-CNN con backbone ResNet-50/MobileNetV2 para la
          detecci\u00f3n y clasificaci\u00f3n de 6 puntos de referencia del campus. El dataset de
          entrenamiento contiene m\u00e1s de 1,236 im\u00e1genes distribuidas en 6 clases: Arco, Aulas 1,
          Aulas 2, S\u00f3tano 1, S\u00f3tano 2 y Aulas_3.{' '}
          Actualmente, la detecci\u00f3n se simula con un m\u00f3dulo mock que puede ser reemplazado por el
          modelo real de TensorFlow Lite.
        </Text>

        <Text style={[styles.subTitle, { marginTop: Spacing.md }]}>Navegaci\u00f3n por Ruta M\u00e1s Corta</Text>
        <Text style={styles.sectionBody}>
          La navegaci\u00f3n se basa en el algoritmo de Dijkstra implementado en TypeScript puro.
          El grafo del campus contiene 9 nodos (6 puntos de referencia y 3 puntos intermedios)
          conectados por aristas ponderadas que representan distancias reales en metros.
          El sistema calcula la ruta m\u00e1s corta y genera instrucciones paso a paso en espa\u00f1ol.
        </Text>
      </View>

      {/* Technologies section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tecnolog\u00edas</Text>
        <View style={styles.techList}>
          {[
            { icon: 'react' as const, label: 'React Native + Expo' },
            { icon: 'language-typescript' as const, label: 'TypeScript' },
            { icon: 'brain' as const, label: 'Faster R-CNN (Simulado)' },
            { icon: 'graph-outline' as const, label: 'Algoritmo de Dijkstra' },
            { icon: 'svg' as const, label: 'react-native-svg' },
          ].map((tech) => (
            <View key={tech.label} style={styles.techRow}>
              <MaterialCommunityIcons name={tech.icon} size={22} color={Colors.primaryRed} />
              <Text style={styles.techLabel}>{tech.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Repository section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Repositorio</Text>
        <Pressable
          onPress={openGitHub}
          style={({ pressed }) => [styles.githubButton, pressed && { opacity: 0.8 }]}
          accessibilityLabel="Abrir repositorio en GitHub"
          accessibilityRole="link"
        >
          <MaterialCommunityIcons name="github" size={24} color={Colors.white} />
          <Text style={styles.githubText}>Ver en GitHub</Text>
        </Pressable>
      </View>

      {/* Credits section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Cr\u00e9ditos</Text>
        <Text style={styles.sectionBody}>
          Desarrollado para la Universidad Aut\u00f3noma de Occidente, Cali, Colombia.
        </Text>
        <Text style={[styles.sectionBody, { marginTop: Spacing.xs }]}>Licencia MIT</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.base,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDE8EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryRed,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  techList: {
    gap: Spacing.sm,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  techLabel: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGray,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    alignSelf: 'flex-start',
  },
  githubText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
