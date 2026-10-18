import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Users,
  IdCard,
  Map,
  Trees,
  Grape,
  Tractor,
} from 'lucide-react-native';

import HeaderStatus from '../components/HeaderStatus';
import DropdownSelector from '../components/DropdownSelector';
import InfoGrid from '../components/InfoGrid';
import GiantButton from '../components/GiantButton';

export interface HomeScreenProps {
  onStartHarvest?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartHarvest }) => {
  // Estado local simulado (listo para reemplazar por Supabase en el futuro)
  const [cuadrilla, setCuadrilla] = useState({
    nombre: 'Cuadrilla Alfa - Uva',
    lider: 'M. Huamán',
    estado: 'Activa',
    totalJornaleros: '24 Jornaleros',
  });

  const [lote, setLote] = useState({
    sector: 'Sector 4 - Lote A01',
    variedad: 'Red Globe / Uva de mesa',
    hilera: 'Hilera 12 a 34',
  });

  const [supervision] = useState({
    capataz: 'Carlos Mendoza',
    capatazId: 'ID: CAP-0894',
    turno: 'Turno Mañana',
    fecha: '24 Octubre 2024',
    clima: '24°C Seco',
    meta: '1,450 Jabas',
  });

  const handleSelectCuadrilla = () => {
    Alert.alert('Cuadrilla', 'Abrir modal de selección de cuadrilla');
  };

  const handleSelectLote = () => {
    Alert.alert('Lote Activo', 'Abrir modal de selección de lote');
  };

  const handleIniciarCosecha = () => {
    if (onStartHarvest) {
      onStartHarvest();
    } else {
      Alert.alert('Cosecha', 'Iniciando registro de bines y pesaje...');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28 }}
      >
        {/* 1. Cabecera de Estado y Logo */}
        <HeaderStatus />

        {/* Banner: Configuración de Jornada */}
        <View className="bg-[#EEF4FF] rounded-2xl p-4 mb-3.5 border border-blue-100/70">
          <View className="flex-row items-center">
            <Tractor size={22} color="#065f46" strokeWidth={2.2} />
            <Text className="text-slate-900 font-black text-[15px] tracking-wider uppercase ml-2">
              CONFIGURACIÓN DE JORNADA
            </Text>
          </View>
          <Text className="text-slate-600 text-xs font-normal mt-1 ml-0.5 leading-4">
            Seleccione los parámetros de trabajo antes de iniciar.
          </Text>
        </View>

        {/* 2. Selector de Cuadrilla */}
        <DropdownSelector
          title="SELECCIONAR CUADRILLA"
          headerIcon={<Users size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={cuadrilla.totalJornaleros}
          badgeVariant="emerald"
          icon={<IdCard size={28} color="#ffffff" strokeWidth={2} />}
          iconBgColor="bg-emerald-700"
          value={cuadrilla.nombre}
          subtitle={`Líder: ${cuadrilla.lider} • ${cuadrilla.estado}`}
          statusIcon={<View className="w-2 h-2 rounded-full bg-emerald-600 mr-1" />}
          statusColor="text-emerald-700"
          onPress={handleSelectCuadrilla}
        />

        {/* 3. Selector de Lote Activo */}
        <DropdownSelector
          title="SELECCIONAR LOTE ACTIVO"
          headerIcon={<Map size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={lote.hilera}
          badgeVariant="blue"
          icon={<Trees size={28} color="#1e3a8a" strokeWidth={2} />}
          iconBgColor="bg-[#DCE8FE]"
          value={lote.sector}
          subtitle={lote.variedad}
          statusIcon={<Grape size={13} color="#b91c1c" strokeWidth={2.2} />}
          statusColor="text-red-700"
          onPress={handleSelectLote}
        />

        {/* 4. Tarjetas Informativas: Supervisión de Campo */}
        <InfoGrid
          supervisorName={supervision.capataz}
          supervisorId={supervision.capatazId}
          shiftName={supervision.turno}
          shiftDate={supervision.fecha}
          weather={supervision.clima}
          targetGoal={supervision.meta}
        />

        {/* 5. Botón Gigante de Acción */}
        <GiantButton
          title="INICIAR COSECHA"
          subtitle="Abrir registro de bines y pesaje"
          onPress={handleIniciarCosecha}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
