import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Montserrat_700Bold, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { OpenSans_400Regular, OpenSans_500Medium } from '@expo-google-fonts/open-sans';
import { NavigationProvider } from '../src/context/NavigationContext';
import ErrorBoundary from '../src/components/ErrorBoundary';
import { Colors } from '../src/utils/constants';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_700Bold,
    Montserrat_600SemiBold,
    OpenSans_400Regular,
    OpenSans_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Safety timeout to avoid stuck splash
  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <NavigationProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen
            name="navigation"
            options={{
              headerShown: true,
              title: 'Navegaci\u00f3n',
              headerTintColor: Colors.primaryRed,
              headerStyle: { backgroundColor: Colors.white },
              headerTitleStyle: { fontWeight: '700', color: Colors.textPrimary },
              presentation: 'card',
            }}
          />
        </Stack>
      </NavigationProvider>
    </ErrorBoundary>
  );
}
