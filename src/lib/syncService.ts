import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export interface Lote { id?: string | number; id_lote?: string | number; nombre?: string; codigo_lote?: string; campanas_lote?: any; [key: string]: any; }
export interface Cuadrilla { id?: string | number; id_cuadrilla?: string | number; nombre?: string; capataz_id?: string; [key: string]: any; }
export interface Trabajador { id?: string | number; id_trabajador?: string | number; dni?: string; nombres?: string; apellidos?: string; uid_nfc?: string; nivel_actual?: string; activo?: boolean; }
export interface RegistroLocal { id_trabajador: string | number; uid_nfc_leido: string; cantidad: number; calidad: 'clean' | 'minor_waste' | 'plant_damage' | string; nombre_trabajador?: string; fecha_hora_marcacion?: string; }

export const STORAGE_KEYS = {
  LOTES: '@lotes', CUADRILLAS: '@cuadrillas', TRABAJADORES: '@trabajadores',
  PENDIENTES: '@registros_pendientes', JORNADA_ACTIVA: '@jornada_activa',
};

const mapCalidad = (calidad: string): string => {
  if (calidad === 'clean') return 'LIMPIA';
  if (calidad === 'minor_waste') return 'MERMA_LEVE';
  if (calidad === 'plant_damage') return 'RECHAZADA_DANO_PLANTA';
  return calidad.toUpperCase();
};

export const syncCatalogos = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const [lotesRes, cuadrillasRes, trabajadoresRes] = await Promise.all([
    supabase.from('lotes').select('*, campanas_lote(*, cultivos(nombre, variedad))'),
    supabase.from('cuadrillas').select('*'),
    supabase.from('trabajadores').select('*').eq('activo', true),
  ]);

  if (lotesRes.error) throw { message: lotesRes.error.message, code: lotesRes.error.code, details: lotesRes.error.details };
  if (cuadrillasRes.error) throw { message: cuadrillasRes.error.message, code: cuadrillasRes.error.code, details: cuadrillasRes.error.details };
  if (trabajadoresRes.error) throw { message: trabajadoresRes.error.message, code: trabajadoresRes.error.code, details: trabajadoresRes.error.details };

  let cuadrillas = cuadrillasRes.data || [];
  if (user?.id) {
    const mias = cuadrillas.filter((c) => (c.capataz_id || c.id_capataz || c.user_id) === user.id);
    if (mias.length > 0) cuadrillas = mias;
  }

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.LOTES, JSON.stringify(lotesRes.data || [])],
    [STORAGE_KEYS.CUADRILLAS, JSON.stringify(cuadrillas)],
    [STORAGE_KEYS.TRABAJADORES, JSON.stringify(trabajadoresRes.data || [])],
  ]);
  return { lotes: lotesRes.data || [], cuadrillas, trabajadores: trabajadoresRes.data || [] };
};

export const getLocalLotes = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.LOTES)) || '[]');
export const getLocalCuadrillas = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.CUADRILLAS)) || '[]');
export const getLocalTrabajadores = async (): Promise<Trabajador[]> => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.TRABAJADORES)) || '[]');
export const getLocalRegistrosPendientes = async (): Promise<RegistroLocal[]> => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.PENDIENTES)) || '[]');

export const saveRegistroLocal = async (registro: RegistroLocal): Promise<RegistroLocal[]> => {
  const pendientes = await getLocalRegistrosPendientes();
  const actualizados = [...pendientes, { ...registro, fecha_hora_marcacion: new Date().toISOString() }];
  await AsyncStorage.setItem(STORAGE_KEYS.PENDIENTES, JSON.stringify(actualizados));
  return actualizados;
};

export const syncRegistrosPendientes = async (id_cuadrilla?: any, id_campana_lote?: any, capataz_id?: any) => {
  const pendientes = await getLocalRegistrosPendientes();
  if (pendientes.length === 0) return { syncedCount: 0 };

  if (!id_cuadrilla) throw { message: 'id_cuadrilla no está definido', code: 'PARAM_NULL', details: 'Falta cuadrilla' };
  if (!id_campana_lote) throw { message: 'id_campana_lote no está definido', code: 'PARAM_NULL', details: 'Falta campaña activa' };

  const hoy = new Date().toISOString().split('T')[0];
  const { data: userRes } = await supabase.auth.getUser();
  const userId = capataz_id || userRes.user?.id || null;

  // 1. Buscar si ya existe la jornada hoy para esta cuadrilla y lote
  let { data: jornada, error: fetchError } = await supabase
    .from('jornadas')
    .select('id_jornada')
    .eq('fecha_jornada', hoy)
    .eq('id_cuadrilla', id_cuadrilla)
    .eq('id_campana_lote', id_campana_lote)
    .maybeSingle();

  if (fetchError) throw { message: fetchError.message, details: fetchError.details, code: fetchError.code };

  // 2. Si no existe, creamos la jornada nueva
  if (!jornada) {
    const { data: newJornada, error: insertError } = await supabase
      .from('jornadas')
      .insert([{
        fecha_jornada: hoy,
        id_cuadrilla,
        id_campana_lote,
        id_capataz_responsable: userId,
        estado: 'CERRADA',
      }])
      .select('id_jornada')
      .single();

    if (insertError) throw { message: insertError.message, details: insertError.details, code: insertError.code };
    jornada = newJornada;
  }

  const idJornada = jornada?.id_jornada;
  const payload = pendientes.map((p) => {
    const calidadMapeada = mapCalidad(p.calidad);
    let motivo = null;
    if (calidadMapeada === 'MERMA_LEVE') {
      motivo = 'Fruto sobremaduro o roce (Registro rápido)';
    } else if (calidadMapeada === 'RECHAZADA_DANO_PLANTA') {
      motivo = 'Corte indebido o rama quebrada reportada por capataz';
    }

    return {
      id_jornada: idJornada,
      id_trabajador: p.id_trabajador,
      uid_nfc_leido: p.uid_nfc_leido || 'NFC-SIM',
      cantidad: p.cantidad || 1,
      calidad: calidadMapeada,
      motivo_merma: motivo,
      fecha_hora_marcacion: p.fecha_hora_marcacion || new Date().toISOString(),
    };
  });

  const { error: regError } = await supabase.from('registros_cosecha').insert(payload);
  if (regError) throw { message: regError.message, details: regError.details, code: regError.code };

  await AsyncStorage.removeItem(STORAGE_KEYS.PENDIENTES);
  return { syncedCount: payload.length, id_jornada: idJornada };
};
