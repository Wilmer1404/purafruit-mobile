import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Nfc } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { getLocalTrabajadores, syncCatalogos, Trabajador } from '../lib/syncService';

let NfcManager: any = null;
let NfcTech: any = null;
try {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default || nfcModule;
  NfcTech = nfcModule.NfcTech;
  NfcManager.start();
} catch (error) {
  console.warn('NfcManager no disponible en este entorno (Expo Go). Usando modo simulación.');
}

export interface NfcAssignScreenProps {
  onBackToHome: () => void;
}

export const NfcAssignScreen: React.FC<NfcAssignScreenProps> = ({ onBackToHome }) => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Trabajador | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocalTrabajadores().then(setTrabajadores).catch(() => Alert.alert('Error', 'Error cargando personal.')).finally(() => setLoading(false));
  }, []);

  const handleRealPhysicalRead = async () => {
    if (!selectedWorker) return;
    if (!NfcManager) return Alert.alert('Aviso NFC', 'El módulo NFC nativo no está disponible. Use la simulación.');
    setSaving(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag?.id) {
        const workerId = selectedWorker.id_trabajador || selectedWorker.id;
        const { error } = await supabase.from('trabajadores').update({ uid_nfc: tag.id }).eq('id_trabajador', workerId);
        if (error) throw error;
        await syncCatalogos();
        setTrabajadores(await getLocalTrabajadores());
        setSelectedWorker(null);
        Alert.alert('Éxito', `Tarjeta NFC (${tag.id}) leída y asignada.`);
      }
    } catch {
      Alert.alert('Aviso NFC', 'No se pudo leer la tarjeta o el dispositivo no soporta NFC nativo. Use la simulación para pruebas en Expo Go.');
    } finally {
      NfcManager?.cancelTechnologyRequest?.();
      setSaving(false);
    }
  };

  const handleSimulatePhysicalRead = async () => {
    if (!selectedWorker) return;
    const workerId = selectedWorker.id_trabajador || selectedWorker.id;
    const newCode = Math.random().toString(16).substring(2, 10).toUpperCase();
    setSaving(true);
    try {
      const { error } = await supabase.from('trabajadores').update({ uid_nfc: newCode }).eq('id_trabajador', workerId);
      if (error) throw error;
      await syncCatalogos();
      setTrabajadores(await getLocalTrabajadores());
      setSelectedWorker(null);
      Alert.alert('Éxito', `Tarjeta NFC (${newCode}) simulada y asignada a ${selectedWorker.nombres}.`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Error al asignar la tarjeta.');
    } finally { setSaving(false); }
  };

  const hasNfc = (uid?: string) => Boolean(uid && uid.trim() !== '' && uid !== 'S/N');

  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity onPress={onBackToHome} className="w-10 h-10 rounded-xl bg-slate-100 items-center justify-center mr-3 active:bg-slate-200">
          <ArrowLeft size={20} color="#334155" strokeWidth={2.2} />
        </TouchableOpacity>
        <Text className="text-slate-900 font-black text-lg">Asignación de Tarjetas NFC</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#0284c7" /></View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {trabajadores.map((worker) => {
            const id = worker.id_trabajador || worker.id;
            const assigned = hasNfc(worker.uid_nfc);
            return (
              <TouchableOpacity
                key={String(id)} activeOpacity={0.7} onPress={() => setSelectedWorker(worker)}
                className="bg-white p-4 rounded-2xl mb-2.5 border border-slate-100 shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-slate-900 font-bold text-base">{worker.nombres} {worker.apellidos}</Text>
                  <Text className="text-slate-500 text-xs mt-0.5">DNI: {worker.dni || 'S/N'} • Nivel: {worker.nivel_actual || 'Estándar'}</Text>
                </View>
                <View className={`px-2.5 py-1 rounded-full ${assigned ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                  <Text className={`text-xs font-bold ${assigned ? 'text-emerald-700' : 'text-rose-700'}`}>{assigned ? `NFC: ${worker.uid_nfc}` : 'Sin Tarjeta Asignada'}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <Modal animationType="slide" transparent visible={Boolean(selectedWorker)} onRequestClose={() => !saving && setSelectedWorker(null)}>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white w-full max-w-sm rounded-3xl p-6 items-center shadow-2xl border border-slate-100">
            <Text className="text-slate-900 font-black text-lg text-center">{selectedWorker?.nombres} {selectedWorker?.apellidos}</Text>
            <Text className="text-slate-500 text-xs mt-1">DNI: {selectedWorker?.dni || 'S/N'} • Nivel: {selectedWorker?.nivel_actual || 'Estándar'}</Text>

            <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center my-5">
              <Nfc size={48} color="#2563eb" strokeWidth={2.4} />
            </View>

            <Text className="text-slate-600 text-xs text-center mb-5 px-2">Acerque la tarjeta física al dispositivo o use la simulación para pruebas.</Text>

            <TouchableOpacity
              activeOpacity={0.8} disabled={saving} onPress={handleRealPhysicalRead}
              className="w-full bg-blue-600 active:bg-blue-700 py-3.5 rounded-2xl items-center justify-center mb-2.5 shadow-sm"
            >
              {saving ? <ActivityIndicator color="#ffffff" size="small" /> : <Text className="text-white font-bold text-sm">Leer Tarjeta Física (NFC)</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8} disabled={saving} onPress={handleSimulatePhysicalRead}
              className="w-full bg-slate-200 active:bg-slate-300 py-3.5 rounded-2xl items-center justify-center mb-2 shadow-xs"
            >
              <Text className="text-slate-800 font-bold text-sm">Simular Lectura Física</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={saving} onPress={() => setSelectedWorker(null)} className="w-full py-2 items-center justify-center">
              <Text className="text-slate-400 font-semibold text-xs">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NfcAssignScreen;
