import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Users, MapPin, Flashlight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NfcRadarButton from '../components/NfcRadarButton';
import HarvestSummaryCard from '../components/HarvestSummaryCard';
import ScanActionSheet, { WorkerInfo } from '../components/ScanActionSheet';
import SelectionModal from '../components/SelectionModal';
import {
  getLocalTrabajadores,
  getLocalRegistrosPendientes,
  saveRegistroLocal,
  syncRegistrosPendientes,
  Trabajador,
  STORAGE_KEYS,
} from '../lib/syncService';

export interface NfcScanScreenProps {
  onBackToHome?: () => void;
}

export const NfcScanScreen: React.FC<NfcScanScreenProps> = ({ onBackToHome }) => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [activeJornada, setActiveJornada] = useState<{ cuadrilla?: any; lote?: any }>({});
  const [totalJabas, setTotalJabas] = useState<number>(0);
  const [lastWorkerName, setLastWorkerName] = useState<string>('Sin registros');
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState<boolean>(false);
  const [currentWorker, setCurrentWorker] = useState<(WorkerInfo & { id_trabajador: any }) | null>(null);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const [workers, pending, activeRaw] = await Promise.all([
        getLocalTrabajadores(),
        getLocalRegistrosPendientes(),
        AsyncStorage.getItem(STORAGE_KEYS.JORNADA_ACTIVA),
      ]);
      setTrabajadores(workers);
      setTotalJabas(pending.length);
      if (pending.length > 0) setLastWorkerName(pending[pending.length - 1].nombre_trabajador || 'Elena R.');
      if (activeRaw) setActiveJornada(JSON.parse(activeRaw));
    })();
  }, []);

  const handleWorkerSelected = (item: any) => {
    const t = trabajadores.find((w) => (w.id_trabajador || w.id) === item.id);
    if (!t) return;
    setCurrentWorker({
      id_trabajador: t.id_trabajador || t.id,
      name: `${t.nombres || ''} ${t.apellidos || ''}`.trim() || 'Trabajador',
      nfcId: t.uid_nfc || 'NFC-5521',
      ficha: t.dni ? `#${t.dni}` : '#1042',
      level: t.nivel_actual || 'EXPERTO',
      initials: (t.nombres?.[0] || 'J') + (t.apellidos?.[0] || 'P'),
    });
    setIsPickerVisible(false);
    setIsActionSheetVisible(true);
  };

  const handleSelectDeliveryOption = async (option: 'clean' | 'minor_waste' | 'plant_damage') => {
    setIsActionSheetVisible(false);
    if (!currentWorker) return;
    const updated = await saveRegistroLocal({
      id_trabajador: currentWorker.id_trabajador,
      uid_nfc_leido: currentWorker.nfcId,
      cantidad: 1,
      calidad: option,
      nombre_trabajador: currentWorker.name,
    });
    setTotalJabas(updated.length);
    setLastWorkerName(currentWorker.name);
    Alert.alert('Registro Guardado', `Jaba guardada en memoria local para ${currentWorker.name}`);
  };

  const performFinish = async () => {
    setIsFinishing(true);
    try {
      const qId = activeJornada?.cuadrilla?.id || activeJornada?.cuadrilla?.id_cuadrilla;
      const lote = activeJornada?.lote;
      const campana = Array.isArray(lote?.campanas_lote) ? lote?.campanas_lote[0] : lote?.campanas_lote;
      const campanaId = campana?.id_campana_lote || campana?.id || lote?.id_campana_lote || null;

      console.log('[PERFORM FINISH] Syncing with params:', { qId, campanaId });
      const res = await syncRegistrosPendientes(qId, campanaId);
      Alert.alert('Jornada Sincronizada', `Se subieron ${res.syncedCount} registro(s) exitosamente.`);
      if (onBackToHome) onBackToHome();
    } catch (err: any) {
      console.error('[SYNC ERROR FULL]:', JSON.stringify(err, null, 2));
      Alert.alert('Error de Sincronización', `Msg: ${err?.message || 'Error desconocido'}\nCode: ${err?.code || 'N/A'}\nDetalles en consola.`);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 24 }}>
        <View className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-2">
          <View className="flex-row items-center justify-between">
            <View className="bg-[#86EFAC] px-3.5 py-1.5 rounded-full flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-950 mr-2" />
              <Text className="text-emerald-950 font-black text-xs uppercase tracking-wide">Escáner Activo</Text>
            </View>
            <TouchableOpacity onPress={() => setIsTorchOn((p) => !p)} className={`w-11 h-11 rounded-2xl items-center justify-center ${isTorchOn ? 'bg-amber-300' : 'bg-[#DCE8FE]'}`}>
              <Flashlight size={20} color={isTorchOn ? '#78350f' : '#1e3a8a'} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>
          <View className="items-start mt-3">
            <View className="bg-[#EEF4FF] px-3.5 py-1.5 rounded-xl flex-row items-center mb-1.5">
              <Users size={15} color="#1e3a8a" strokeWidth={2.2} />
              <Text className="text-blue-950 font-black text-sm ml-2">{activeJornada?.cuadrilla?.nombre || 'Cuadrilla Activa'}</Text>
            </View>
            <View className="bg-[#EEF4FF] px-3 py-1 rounded-xl flex-row items-center">
              <MapPin size={13} color="#64748b" strokeWidth={2.2} />
              <Text className="text-slate-600 text-xs font-bold ml-1.5">{activeJornada?.lote?.nombre || activeJornada?.lote?.codigo_lote || 'Lote Activo'}</Text>
            </View>
          </View>
        </View>

        <NfcRadarButton onPress={() => setIsPickerVisible(true)} />

        {isFinishing ? (
          <ActivityIndicator size="large" color="#047857" className="my-4" />
        ) : (
          <HarvestSummaryCard totalJabas={totalJabas} ratePerHour="+15/hr" lastRecordText={`Último: ${lastWorkerName}`} onFinishShift={() => Alert.alert('Finalizar Jornada', `¿Desea cerrar la jornada y sincronizar ${totalJabas} jaba(s) a Supabase?`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Finalizar y Sincronizar', style: 'destructive', onPress: performFinish }])} />
        )}
      </ScrollView>

      <SelectionModal visible={isPickerVisible} title="Simular Lectura NFC (Trabajador)" items={trabajadores.map((t) => ({ id: t.id_trabajador || t.id || '', label: `${t.nombres || ''} ${t.apellidos || ''}`.trim() || 'Trabajador', sublabel: `NFC: ${t.uid_nfc || 'S/N'} • DNI: ${t.dni || 'S/N'}`, badge: t.nivel_actual || 'ACTIVO' }))} onSelect={handleWorkerSelected} onClose={() => setIsPickerVisible(false)} />
      {currentWorker && (
        <ScanActionSheet visible={isActionSheetVisible} worker={currentWorker} jabaNumber={totalJabas + 1} loteName={activeJornada?.lote?.nombre || 'Lote Activo'} onSelectOption={handleSelectDeliveryOption} onClose={() => setIsActionSheetVisible(false)} />
      )}
    </SafeAreaView>
  );
};

export default NfcScanScreen;
