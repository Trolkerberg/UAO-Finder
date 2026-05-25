import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius } from '../src/utils/constants';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>\ud83d\udccd</Text>
      <Text style={styles.title}>P\u00e1gina no encontrada</Text>
      <Text style={styles.subtitle}>La ruta que buscas no existe</Text>
      <Pressable
        style={styles.button}
        onPress={() => router.replace('/tabs/camera')}
        accessibilityLabel="Volver al inicio"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  emoji: { fontSize: 48, marginBottom: Spacing.base },
  title: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: Spacing.lg },
  button: {
    backgroundColor: Colors.primaryRed,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
