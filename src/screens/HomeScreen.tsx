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
import SelectionModal from '../components/SelectionModal';
import { supabase } from '../lib/supabase';
import {
  syncCatalogos, getLocalLotes, getLocalCuadrillas, getLocalRegistrosPendientes,
  syncRegistrosPendientes, Lote, Cuadrilla, STORAGE_KEYS,
} from '../lib/syncService';

export interface HomeScreenProps {
  onStartHarvest?: () => void;
  onNavigateToAssignNfc?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartHarvest, onNavigateToAssignNfc }) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cuadrillas, setCuadrillas] = useState<Cuadrilla[]>([]);
  const [selectedCuadrilla, setSelectedCuadrilla] = useState<Cuadrilla | null>(null);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'cuadrilla' | 'lote' | null>(null);

  useEffect(() => {
    (async () => {
      const [c, l] = await Promise.all([getLocalCuadrillas(), getLocalLotes()]);
      setCuadrillas(c); setLotes(l);
      if (c.length > 0 && !selectedCuadrilla) setSelectedCuadrilla(c[0]);
      if (l.length > 0 && !selectedLote) setSelectedLote(l[0]);
    })();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncCatalogos();
      setCuadrillas(res.cuadrillas); setLotes(res.lotes);
      if (res.cuadrillas.length > 0) setSelectedCuadrilla(res.cuadrillas[0]);
      if (res.lotes.length > 0) setSelectedLote(res.lotes[0]);
      Alert.alert('Sincronización Exitosa', `Se sincronizaron ${res.cuadrillas.length} cuadrilla(s) y ${res.lotes.length} lote(s).`);
    } catch (err: any) { Alert.alert('Error', err?.message || 'Fallo de sincronización'); }
    finally { setSyncing(false); }
  };

  const handleLogout = async () => {
    const pendientes = await getLocalRegistrosPendientes();
    const limpiarCacheYSalir = async () => {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CUADRILLAS,
        STORAGE_KEYS.TRABAJADORES,
        STORAGE_KEYS.LOTES,
        STORAGE_KEYS.JORNADA_ACTIVA,
      ]);
      await supabase.auth.signOut();
    };

    if (pendientes.length > 0) {
      Alert.alert('⚠️ Datos Pendientes', 'Tienes jabas sin sincronizar a la nube.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sincronizar y Salir', onPress: async () => {
          try {
            const qId = selectedCuadrilla?.id || selectedCuadrilla?.id_cuadrilla;
            const camp = Array.isArray(selectedLote?.campanas_lote) ? selectedLote?.campanas_lote[0] : selectedLote?.campanas_lote;
            await syncRegistrosPendientes(qId, camp?.id_campana_lote || camp?.id || selectedLote?.id_campana_lote || null);
            await limpiarCacheYSalir();
          } catch (err: any) { Alert.alert('Error', err?.message || 'No se pudo sincronizar.'); }
        }},
        { text: 'Descartar y Salir', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEYS.PENDIENTES);
          await limpiarCacheYSalir();
        } },
      ]);
    } else {
      Alert.alert('Cerrar Sesión', '¿Deseas cerrar sesión en el terminal?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, Salir', style: 'destructive', onPress: () => limpiarCacheYSalir() },
      ]);
    }
  };

  const handleStart = async () => {
    if (!selectedCuadrilla || !selectedLote) return Alert.alert('Atención', 'Seleccione cuadrilla y lote antes de iniciar.');
    await AsyncStorage.setItem('@jornada_activa', JSON.stringify({ cuadrilla: selectedCuadrilla, lote: selectedLote }));
    if (onStartHarvest) onStartHarvest();
  };

  const activeCultivo = selectedLote?.campanas_lote?.[0]?.cultivos;
  const cultivoText = activeCultivo ? `${activeCultivo.nombre || ''} / ${activeCultivo.variedad || ''}` : 'Cultivo estándar';
  const cuadrillaItems = cuadrillas.map((c) => ({ id: c.id || c.id_cuadrilla || c.nombre || '', label: c.nombre || 'Cuadrilla', sublabel: `Líder: ${c.capataz || 'Capataz'}`, badge: c.total_jornaleros ? `${c.total_jornaleros}p` : undefined }));
  const loteItems = lotes.map((l) => ({ id: l.id || l.id_lote || l.nombre || '', label: l.nombre || l.codigo_lote || 'Lote', sublabel: l.campanas_lote?.[0]?.cultivos?.nombre || 'Cultivo Activo', badge: l.hilera ? `H-${l.hilera}` : undefined }));

  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28 }}>
        <HeaderStatus onLogout={handleLogout} />
        <TouchableOpacity activeOpacity={0.8} disabled={syncing} onPress={handleSync} className="bg-blue-50 border border-blue-200/80 rounded-2xl py-3 px-4 flex-row items-center justify-center mb-3">
          {syncing ? <ActivityIndicator size="small" color="#1e3a8a" /> : (
            <View className="flex-row items-center justify-center">
              <RefreshCw size={15} color="#1e3a8a" strokeWidth={2.4} />
              <Text className="text-blue-950 font-black text-xs uppercase tracking-wider ml-2">🔄 Sincronizar Datos (Modo Offline)</Text>
            </View>
          )}
        </TouchableOpacity>
        <View className="bg-[#EEF4FF] rounded-2xl p-3.5 mb-3 border border-blue-100/70">
          <View className="flex-row items-center">
            <Tractor size={20} color="#065f46" strokeWidth={2.2} />
            <Text className="text-slate-900 font-black text-sm tracking-wider uppercase ml-2">Configuración de Jornada</Text>
          </View>
          <Text className="text-slate-600 text-xs mt-1">Seleccione los parámetros de trabajo antes de iniciar.</Text>
        </View>
        <DropdownSelector
          title="SELECCIONAR CUADRILLA" headerIcon={<Users size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={selectedCuadrilla?.total_jornaleros ? `${selectedCuadrilla.total_jornaleros}p` : undefined} badgeVariant="emerald"
          icon={<IdCard size={28} color="#ffffff" strokeWidth={2} />} iconBgColor="bg-emerald-700"
          value={selectedCuadrilla?.nombre || 'Toque para seleccionar'} subtitle={selectedCuadrilla ? `Líder: ${selectedCuadrilla.capataz || 'Asignado'} • Activa` : 'Sin cuadrilla'}
          statusIcon={<View className="w-2 h-2 rounded-full bg-emerald-600 mr-1" />} statusColor="text-emerald-700" onPress={() => setModalType('cuadrilla')}
        />
        <DropdownSelector
          title="SELECCIONAR LOTE ACTIVO" headerIcon={<Map size={14} color="#475569" strokeWidth={2.2} />}
          badgeText={selectedLote?.hilera ? `H-${selectedLote.hilera}` : undefined} badgeVariant="blue"
          icon={<Trees size={28} color="#1e3a8a" strokeWidth={2} />} iconBgColor="bg-[#DCE8FE]"
          value={selectedLote?.nombre || selectedLote?.codigo_lote || 'Toque para seleccionar'} subtitle={selectedLote ? cultivoText : 'Sin lote'}
          statusIcon={<Grape size={13} color="#b91c1c" strokeWidth={2.2} />} statusColor="text-red-700" onPress={() => setModalType('lote')}
        />
        <InfoGrid supervisorName="Carlos Mendoza" shiftName="Turno Mañana" weather="24°C Seco" targetGoal="1,450 Jabas" />
        <GiantButton title="INICIAR COSECHA" subtitle="Abrir registro de bines y pesaje" onPress={handleStart} />
        {onNavigateToAssignNfc && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToAssignNfc}
            className="bg-blue-100 border border-blue-200 rounded-2xl py-3.5 px-4 flex-row items-center justify-center mt-3"
          >
            <IdCard size={18} color="#1d4ed8" strokeWidth={2.2} />
            <Text className="text-blue-700 font-bold text-sm ml-2">Asignar Tarjetas NFC a Personal</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <SelectionModal
        visible={modalType !== null} title={modalType === 'cuadrilla' ? 'Seleccionar Cuadrilla' : 'Seleccionar Lote Activo'}
        items={modalType === 'cuadrilla' ? cuadrillaItems : loteItems}
        selectedId={modalType === 'cuadrilla' ? (selectedCuadrilla?.id || selectedCuadrilla?.id_cuadrilla || selectedCuadrilla?.nombre) : (selectedLote?.id || selectedLote?.id_lote || selectedLote?.nombre)}
        onSelect={(item) => {
          if (modalType === 'cuadrilla') setSelectedCuadrilla(cuadrillas.find((c) => (c.id || c.id_cuadrilla || c.nombre) === item.id) || null);
          if (modalType === 'lote') setSelectedLote(lotes.find((l) => (l.id || l.id_lote || l.nombre) === item.id) || null);
          setModalType(null);
        }} onClose={() => setModalType(null)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
