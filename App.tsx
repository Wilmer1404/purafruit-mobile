import './global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NfcScanScreen from './src/screens/NfcScanScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<'home' | 'scan'>('home');

  useEffect(() => {
    // 1. Verificar sesión persistida existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Escuchar cambios de autenticación en tiempo real
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {loading ? (
        <View className="flex-1 items-center justify-center bg-slate-900" style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : !session ? (
        <LoginScreen />
      ) : activeScreen === 'scan' ? (
        <NfcScanScreen onBackToHome={() => setActiveScreen('home')} />
      ) : (
        <HomeScreen onStartHarvest={() => setActiveScreen('scan')} />
      )}
    </SafeAreaProvider>
  );
}