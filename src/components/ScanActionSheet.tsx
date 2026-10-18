import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SquareCheck, TriangleAlert, OctagonAlert, X } from 'lucide-react-native';

export interface WorkerInfo {
  name: string;
  nfcId: string;
  ficha: string;
  level: string;
  initials: string;
}

export type DeliveryStatus = 'clean' | 'minor_waste' | 'plant_damage';

export interface ScanActionSheetProps {
  visible: boolean;
  onClose: () => void;
  worker?: WorkerInfo;
  jabaNumber?: number | string;
  loteName?: string;
  onSelectOption: (option: DeliveryStatus) => void;
}

const ACTION_OPTIONS = [
  {
    key: 'clean' as DeliveryStatus,
    title: 'Jaba Limpia',
    subtitle: 'Calidad aprobada',
    badge: '+1 JABA',
    bgColor: 'bg-[#00875a]',
    badgeBg: 'bg-emerald-500/80',
    badgeText: 'text-white',
    icon: <SquareCheck size={26} color="#ffffff" strokeWidth={2.4} />,
  },
  {
    key: 'minor_waste' as DeliveryStatus,
    title: 'Merma Leve',
    subtitle: 'Fruto sobremaduro o roce',
    badge: '(Con observación)',
    bgColor: 'bg-[#f59e0b]',
    badgeBg: 'bg-amber-400',
    badgeText: 'text-amber-950',
    icon: <TriangleAlert size={26} color="#ffffff" strokeWidth={2.4} />,
  },
  {
    key: 'plant_damage' as DeliveryStatus,
    title: 'Daño a Planta',
    subtitle: 'Alerta a agrónomo',
    badge: '(Reportar incidencia)',
    bgColor: 'bg-[#e11d48]',
    badgeBg: 'bg-rose-700',
    badgeText: 'text-white',
    icon: <OctagonAlert size={26} color="#ffffff" strokeWidth={2.4} />,
  },
];

export const ScanActionSheet: React.FC<ScanActionSheetProps> = ({
  visible,
  onClose,
  worker = {
    name: 'Juan Diego Pérez',
    nfcId: '5521-P',
    ficha: '#1042',
    level: 'EXPERTO',
    initials: 'JP',
  },
  jabaNumber = 143,
  loteName = 'Lote A01',
  onSelectOption,
}) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-slate-950/60 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-[32px] px-5 pt-3 pb-8 w-full shadow-2xl">
              <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />
              {/* Cabecera del Trabajador */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-12 h-12 rounded-full bg-[#00875a] items-center justify-center mr-3 shadow-xs">
                    <Text className="text-white font-black text-base">{worker.initials}</Text>
                  </View>
                  <View className="flex-1">
                    <Text numberOfLines={1} className="text-slate-900 font-black text-lg tracking-tight">
                      {worker.name}
                    </Text>
                    <Text className="text-slate-500 text-xs font-semibold mt-0.5">
                      NFC: {worker.nfcId} • Ficha: {worker.ficha}
                    </Text>
                  </View>
                </View>
                <View className="bg-[#86EFAC] px-3 py-1 rounded-full flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-emerald-950 mr-1.5" />
                  <Text className="text-emerald-950 font-black text-[11px] tracking-wider uppercase">
                    {worker.level}
                  </Text>
                </View>
              </View>
              {/* Pregunta Principal */}
              <View className="border-t border-slate-100 pt-3 mb-4">
                <Text className="text-slate-900 font-black text-lg tracking-tight">
                  ¿Cuál es el estado de la entrega?
                </Text>
                <Text className="text-slate-500 text-xs font-medium mt-1">
                  Confirmación de pesaje • Jaba #{jabaNumber} ({loteName})
                </Text>
              </View>
              {/* 3 Botones Masivos */}
              {ACTION_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.85}
                  onPress={() => onSelectOption(item.key)}
                  className={`${item.bgColor} rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    {item.icon}
                    <View className="ml-3">
                      <Text className="text-white font-black text-base">{item.title}</Text>
                      <Text className="text-white/80 text-xs font-medium">{item.subtitle}</Text>
                    </View>
                  </View>
                  <View className={`${item.badgeBg} px-3 py-1.5 rounded-xl`}>
                    <Text className={`${item.badgeText} font-black text-xs`}>{item.badge}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {/* Botón Cancelar */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                className="flex-row items-center justify-center py-2 mt-1"
              >
                <X size={16} color="#475569" strokeWidth={2.5} />
                <Text className="text-slate-600 font-bold text-xs ml-1.5">
                  Cancelar / Volver a escanear
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ScanActionSheet;
