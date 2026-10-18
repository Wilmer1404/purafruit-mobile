import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Users, MapPin, Flashlight } from 'lucide-react-native';

import NfcRadarButton from '../components/NfcRadarButton';
import HarvestSummaryCard from '../components/HarvestSummaryCard';
import ScanActionSheet from '../components/ScanActionSheet';

export interface NfcScanScreenProps {
  onBackToHome?: () => void;
}

export const NfcScanScreen: React.FC<NfcScanScreenProps> = ({ onBackToHome }) => {
  // Estado para controlar la visibilidad del Action Sheet de escaneo
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Mock data del contexto de la jornada activa
  const [sessionData, setSessionData] = useState({
    cuadrilla: 'Cuadrilla Alfa - Uva',
    lote: 'Sector 4 • Lote A01',
    totalJabas: 142,
    ratePerHour: '+18/hr',
    lastRecord: 'Último registro: hace 2 min (Elena R.)',
  });

  const handleToggleTorch = () => {
    setIsTorchOn((prev) => !prev);
  };

  const handleSelectDeliveryOption = (
    option: 'clean' | 'minor_waste' | 'plant_damage'
  ) => {
    setIsScanning(false);
    const messages = {
      clean: 'Jaba limpia registrada exitosamente (+1 Jaba).',
      minor_waste: 'Jaba con merma leve registrada con observación.',
      plant_damage: 'Incidencia de daño a planta reportada al agrónomo.',
    };

    setSessionData((prev) => ({
      ...prev,
      totalJabas: option !== 'plant_damage' ? prev.totalJabas + 1 : prev.totalJabas,
      lastRecord: 'Último registro: recién registrado (Juan D. P.)',
    }));

    Alert.alert('Registro de Entrega', messages[option]);
  };

  const handleFinishShift = () => {
    Alert.alert(
      'Finalizar Jornada',
      '¿Desea cerrar el pesaje y sincronizar todas las entregas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: () => {
            if (onBackToHome) onBackToHome();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 }}
      >
        {/* Cabecera Superior: Escáner Activo, Linterna y Contexto */}
        <View className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-2">
          {/* Fila 1: Píldora de Estado y Botón de Linterna */}
          <View className="flex-row items-center justify-between">
            <View className="bg-[#86EFAC] px-3.5 py-1.5 rounded-full flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-950 mr-2" />
              <Text className="text-emerald-950 font-black text-xs uppercase tracking-wide">
                Escáner Activo
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleToggleTorch}
              className={`w-11 h-11 rounded-2xl items-center justify-center ${
                isTorchOn ? 'bg-amber-300' : 'bg-[#DCE8FE]'
              }`}
            >
              <Flashlight
                size={20}
                color={isTorchOn ? '#78350f' : '#1e3a8a'}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>

          {/* Fila 2: Etiquetas de Cuadrilla y Lote Activo */}
          <View className="items-start mt-3 space-y-1.5">
            <View className="bg-[#EEF4FF] px-3.5 py-1.5 rounded-xl flex-row items-center mb-1.5">
              <Users size={15} color="#1e3a8a" strokeWidth={2.2} />
              <Text className="text-blue-950 font-black text-sm ml-2">
                {sessionData.cuadrilla}
              </Text>
            </View>

            <View className="bg-[#EEF4FF] px-3 py-1 rounded-xl flex-row items-center">
              <MapPin size={13} color="#64748b" strokeWidth={2.2} />
              <Text className="text-slate-600 text-xs font-bold ml-1.5">
                {sessionData.lote}
              </Text>
            </View>
          </View>
        </View>

        {/* Componente Central: Radar NFC Interactivo */}
        <NfcRadarButton onPress={() => setIsScanning(true)} />

        {/* Componente Inferior: Resumen de Cosecha y Finalizar */}
        <HarvestSummaryCard
          totalJabas={sessionData.totalJabas}
          ratePerHour={sessionData.ratePerHour}
          lastRecordText={sessionData.lastRecord}
          onFinishShift={handleFinishShift}
        />
      </ScrollView>

      {/* Modal / Bottom Sheet de Acción tras Escaneo */}
      <ScanActionSheet
        visible={isScanning}
        onClose={() => setIsScanning(false)}
        onSelectOption={handleSelectDeliveryOption}
      />
    </SafeAreaView>
  );
};

export default NfcScanScreen;
