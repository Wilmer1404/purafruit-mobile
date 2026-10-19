import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Users, IdCard, Map, Trees, Grape, Tractor, RefreshCw } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderStatus from '../components/HeaderStatus';
import DropdownSelector from '../components/DropdownSelector';
import InfoGrid from '../components/InfoGrid';
import GiantButton from '../components/GiantButton';
import SelectionModal, { SelectionItem } from '../components/SelectionModal';
import { syncCatalogos, getLocalLotes, getLocalCuadrillas, Lote, Cuadrilla } from '../lib/syncService';

export interface HomeScreenProps {
  onStartHarvest?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartHarvest }) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cuadrillas, setCuadrillas] = useState<Cuadrilla[]>([]);
  const [selectedCuadrilla, setSelectedCuadrilla] = useState<Cuadrilla | null>(null);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'cuadrilla' | 'lote' | null>(null);

  const loadLocalData = async () => {
    const [savedCuadrillas, savedLotes] = await Promise.all([getLocalCuadrillas(), getLocalLotes()]);
    setCuadrillas(savedCuadrillas);
    setLotes(savedLotes);
    if (savedCuadrillas.length > 0 && !selectedCuadrilla) setSelectedCuadrilla(savedCuadrillas[0]);
    if (savedLotes.length > 0 && !selectedLote) setSelectedLote(savedLotes[0]);
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncCatalogos();
      setCuadrillas(result.cuadrillas);
      setLotes(result.lotes);
      if (result.cuadrillas.length > 0) setSelectedCuadrilla(result.cuadrillas[0]);
      if (result.lotes.length > 0) setSelectedLote(result.lotes[0]);
      Alert.alert('Sincronización Exitosa', `Se sincronizaron ${result.cuadrillas.length} cuadrilla(s) y ${result.lotes.length} lote(s) en almacenamiento local.`);
    } catch (error: any) {
      Alert.alert('Error de Sincronización', error.message || 'No se pudo conectar a Supabase.');
    } finally {
      setSyncing(false);
    }
  };

  const handleStart = async () => {
    if (!selectedCuadrilla || !selectedLote) {
      Alert.alert('Atención', 'Seleccione una cuadrilla y un lote antes de iniciar.');
      return;
    }
    await AsyncStorage.setItem('@jornada_activa', JSON.stringify({ cuadrilla: selectedCuadrilla, lote: selectedLote }));
    if (onStartHarvest) onStartHarvest();
  };

  const activeCultivo = selectedLote?.campanas_lote?.[0]?.cultivos;
  const cultivoText = activeCultivo ? `${activeCultivo.nombre || ''} / ${activeCultivo.variedad || ''}` : 'Cultivo estándar';

  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28 }}>
        <HeaderStatus />

        {/* Botón de Sincronización Offline */}
        <TouchableOpacity activeOpacity={0.8} disabled={syncing} onPress={handleSync} className="bg-blue-50 border border-blue-200/80 rounded-2xl py-3 px-4 flex-row items-center justify-center mb-3.5">
          {syncing ? <ActivityIndicator size="small" color="#1e3a8a" /> : (
            <>
              <RefreshCw size={15} color="#1e3a8a" strokeWidth={2.4} />
              <Text className="text-blue-950 font-black text-xs uppercase tracking-wider ml-2">🔄 Sincronizar Datos (Modo Offline)</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Banner Configuración */}
        <View className="bg-[#EEF4FF] rounded-2xl p-4 mb-3.5 border border-blue-100/70">
          <View className="flex-row items-center">
            <Tractor size={22} color="#065f46" strokeWidth={2.2} />
            <Text className="text-slate-900 font-black text-[15px] tracking-wider uppercase ml-2">CONFIGURACIÓN DE JORNADA</Text>
          </View>
          <Text className="text-slate-600 text-xs font-normal mt-1 leading-4">Seleccione los parámetros de trabajo antes de iniciar.</Text>
        </View>

        {/* Selector de Cuadrilla Real */}
        <DropdownSelector
          title="SELECCIONAR CUADRILLA"
          headerIcon={<Users size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={selectedCuadrilla?.total_jornaleros ? `${selectedCuadrilla.total_jornaleros} Jornaleros` : undefined}
          badgeVariant="emerald"
          icon={<IdCard size={28} color="#ffffff" strokeWidth={2} />}
          iconBgColor="bg-emerald-700"
          value={selectedCuadrilla?.nombre || 'Toque para seleccionar'}
          subtitle={selectedCuadrilla ? `Líder: ${selectedCuadrilla.capataz || 'Asignado'} • Activa` : 'Sin cuadrilla seleccionada'}
          statusIcon={<View className="w-2 h-2 rounded-full bg-emerald-600 mr-1" />}
          statusColor="text-emerald-700"
          onPress={() => setModalType('cuadrilla')}
        />

        {/* Selector de Lote Real */}
        <DropdownSelector
          title="SELECCIONAR LOTE ACTIVO"
          headerIcon={<Map size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={selectedLote?.hilera ? `Hilera ${selectedLote.hilera}` : undefined}
          badgeVariant="blue"
          icon={<Trees size={28} color="#1e3a8a" strokeWidth={2} />}
          iconBgColor="bg-[#DCE8FE]"
          value={selectedLote?.nombre || selectedLote?.codigo_lote || 'Toque para seleccionar'}
          subtitle={selectedLote ? cultivoText : 'Sin lote seleccionado'}
          statusIcon={<Grape size={13} color="#b91c1c" strokeWidth={2.2} />}
          statusColor="text-red-700"
          onPress={() => setModalType('lote')}
        />

        <InfoGrid supervisorName="Carlos Mendoza" shiftName="Turno Mañana" weather="24°C Seco" targetGoal="1,450 Jabas" />
        <GiantButton title="INICIAR COSECHA" subtitle="Abrir registro de bines y pesaje" onPress={handleStart} />
      </ScrollView>

      {/* Modal de Selección Cuadrilla / Lote */}
      <SelectionModal
        visible={modalType !== null}
        title={modalType === 'cuadrilla' ? 'Seleccionar Cuadrilla' : 'Seleccionar Lote Activo'}
        items={modalType === 'cuadrilla'
          ? cuadrillas.map((c) => ({ id: c.id || c.id_cuadrilla || c.nombre || '', label: c.nombre || 'Cuadrilla', sublabel: `Líder: ${c.capataz || 'Capataz'}`, badge: c.total_jornaleros ? `${c.total_jornaleros}p` : undefined }))
          : lotes.map((l) => ({ id: l.id || l.id_lote || l.nombre || '', label: l.nombre || l.codigo_lote || 'Lote', sublabel: l.campanas_lote?.[0]?.cultivos?.nombre || 'Cultivo Activo', badge: l.hilera ? `Hilera ${l.hilera}` : undefined }))}
        selectedId={modalType === 'cuadrilla' ? (selectedCuadrilla?.id || selectedCuadrilla?.id_cuadrilla || selectedCuadrilla?.nombre) : (selectedLote?.id || selectedLote?.id_lote || selectedLote?.nombre)}
        onSelect={(item) => {
          if (modalType === 'cuadrilla') setSelectedCuadrilla(cuadrillas.find((c) => (c.id || c.id_cuadrilla || c.nombre) === item.id) || null);
          if (modalType === 'lote') setSelectedLote(lotes.find((l) => (l.id || l.id_lote || l.nombre) === item.id) || null);
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
