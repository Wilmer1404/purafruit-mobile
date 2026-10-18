import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import NfcScanScreen from './src/screens/NfcScanScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'scan'>('scan');

  if (currentScreen === 'scan') {
    return <NfcScanScreen onBackToHome={() => setCurrentScreen('home')} />;
  }

  return <HomeScreen onStartHarvest={() => setCurrentScreen('scan')} />;
}