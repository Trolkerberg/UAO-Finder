import React, { useState, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../../src/components/SearchBar';
import LandmarkCard from '../../src/components/LandmarkCard';
import { detectableLandmarks } from '../../src/data/landmarks';
import { useNavigation } from '../../src/context/NavigationContext';
import { Colors, Spacing } from '../../src/utils/constants';
import { Landmark } from '../../src/utils/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Simple accent-insensitive matching
function normalizeText(text: string): string {
  return (text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function DestinationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelectedDestination } = useNavigation();

  const filtered = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return detectableLandmarks ?? [];
    return (detectableLandmarks ?? []).filter((l) =>
      normalizeText(l?.name ?? '').includes(query)
    );
  }, [searchQuery]);

  const handleSelect = (landmark: Landmark) => {
    setSelectedDestination(landmark);
    router.push('/navigation');
  };

  const renderItem = ({ item }: { item: Landmark }) => (
    <LandmarkCard
      landmark={item}
      onPress={() => handleSelect(item)}
      style={styles.card}
    />
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.headerTitle}>Destinos</Text>
        <View style={styles.headerAccent} />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar destino..."
        style={styles.searchBar}
      />

      {(filtered?.length ?? 0) === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="magnify" size={48} color={Colors.inactive} />
          <Text style={styles.emptyText}>No se encontraron destinos</Text>
        </View>
      ) : (
        <FlatList
          data={filtered ?? []}
          renderItem={renderItem}
          keyExtractor={(item) => item?.id ?? ''}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerAccent: {
    width: 40,
    height: 3,
    backgroundColor: Colors.primaryRed,
    borderRadius: 2,
    marginTop: 6,
  },
  searchBar: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  grid: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
  },
  card: {
    flex: 1,
    margin: Spacing.xs,
    maxWidth: '48%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});
