import './global.css';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NfcScanScreen from './src/screens/NfcScanScreen';
import NfcAssignScreen from './src/screens/NfcAssignScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<'home' | 'scan' | 'assign_nfc'>('home');

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

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-slate-900" style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      );
    }

    if (!session) return <LoginScreen />;
    if (activeScreen === 'scan') return <NfcScanScreen onBackToHome={() => setActiveScreen('home')} />;
    if (activeScreen === 'assign_nfc') return <NfcAssignScreen onBackToHome={() => setActiveScreen('home')} />;

    return (
      <HomeScreen
        onStartHarvest={() => setActiveScreen('scan')}
        onNavigateToAssignNfc={() => setActiveScreen('assign_nfc')}
      />
    );
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {renderContent()}
    </SafeAreaProvider>
  );
}