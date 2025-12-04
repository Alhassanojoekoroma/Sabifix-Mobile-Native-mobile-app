import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingContext } from '../context/OnboardingContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  // Check if user has seen onboarding
  useEffect(() => {
    AsyncStorage.getItem('hasSeenOnboarding').then((value) => {
      setHasSeenOnboarding(value === 'true');
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!initialized || !loaded || hasSeenOnboarding === null) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = String(segments[0]) === 'onboarding';

    // If user hasn't seen onboarding, show it
    if (!hasSeenOnboarding && !inOnboarding) {
      router.replace('/onboarding' as any);
    }
    // If logged in and in auth group, go to main app
    else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
    // If not logged in
    else if (!session) {
      // If we are on onboarding and have seen it, go to login
      if (inOnboarding && hasSeenOnboarding) {
        router.replace('/auth/login');
      }
      // If not in auth group and not in onboarding, go to login
      else if (!inAuthGroup && !inOnboarding) {
        router.replace('/auth/login');
      }
    }
  }, [session, initialized, segments, loaded, hasSeenOnboarding]);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setHasSeenOnboarding(true);
    // Explicitly navigate to login after completing onboarding
    router.replace('/auth/login');
  };

  if (!loaded || !initialized || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }}>
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OnboardingContext.Provider value={{ completeOnboarding }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="issue/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </OnboardingContext.Provider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
