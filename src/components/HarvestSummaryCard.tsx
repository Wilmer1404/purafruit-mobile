import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Archive, RotateCcw, Power } from 'lucide-react-native';

export interface HarvestSummaryCardProps {
  totalJabas?: number | string;
  ratePerHour?: string;
  lastRecordText?: string;
  onFinishShift?: () => void;
}

export const HarvestSummaryCard: React.FC<HarvestSummaryCardProps> = ({
  totalJabas = 142,
  ratePerHour = '+18/hr',
  lastRecordText = 'Último registro: hace 2 min (Elena R.)',
  onFinishShift,
}) => {
  return (
    <View className="w-full">
      {/* Tarjeta de Métricas de Cosecha */}
      <View className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm border border-slate-100 mb-3">
        {/* Lado Izquierdo: Total de Jabas y Último Registro */}
        <View className="flex-1 mr-3">
          <Text className="text-slate-500 font-extrabold text-[11px] tracking-wider uppercase mb-0.5">
            TOTAL JABAS HOY
          </Text>

          <View className="flex-row items-center">
            <Text className="text-slate-900 font-black text-3xl tracking-tight">
              {totalJabas}
            </Text>
            <View className="bg-[#86EFAC] px-2.5 py-0.5 rounded-full ml-2.5">
              <Text className="text-emerald-950 font-black text-xs">
                {ratePerHour}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-1.5">
            <RotateCcw size={12} color="#64748b" strokeWidth={2.2} />
            <Text
              numberOfLines={1}
              className="text-slate-500 text-xs font-semibold ml-1.5"
            >
              {lastRecordText}
            </Text>
          </View>
        </View>

        {/* Lado Derecho: Contenedor con Ícono de Jaba */}
        <View className="w-14 h-14 bg-[#DCE8FE] rounded-2xl items-center justify-center">
          <Archive size={26} color="#005c3b" strokeWidth={2.2} />
        </View>
      </View>

      {/* Botón Secundario: Finalizar Jornada */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onFinishShift}
        className="w-full bg-[#DCE8FE] rounded-2xl py-3.5 flex-row items-center justify-center"
      >
        <Power size={18} color="#dc2626" strokeWidth={2.6} />
        <Text className="text-slate-900 font-black text-base ml-2 tracking-wide">
          Finalizar Jornada
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HarvestSummaryCard;
