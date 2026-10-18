import React from 'react';
import { View, Text } from 'react-native';
import {
  CheckCircle2,
  User,
  Sun,
  Thermometer,
  Package,
} from 'lucide-react-native';

export interface InfoGridProps {
  supervisorName?: string;
  supervisorId?: string;
  shiftName?: string;
  shiftDate?: string;
  weather?: string;
  targetGoal?: string;
  statusBadge?: string;
}

export const InfoGrid: React.FC<InfoGridProps> = ({
  supervisorName = 'Carlos Mendoza',
  supervisorId = 'ID: CAP-0894',
  shiftName = 'Turno Mañana',
  shiftDate = '24 Octubre 2024',
  weather = '24°C Seco',
  targetGoal = '1,450 Jabas',
  statusBadge = 'VALIDADO',
}) => {
  return (
    <View className="bg-[#EAF0FE] rounded-3xl p-4 mb-4 border border-blue-100">
      {/* Cabecera de la Sección: Supervisión de Campo */}
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-slate-700 font-extrabold text-[11px] tracking-wider uppercase">
          SUPERVISIÓN DE CAMPO
        </Text>
        <View className="flex-row items-center">
          <CheckCircle2 size={15} color="#047857" strokeWidth={2.5} />
          <Text className="text-emerald-800 font-extrabold text-[11px] ml-1 uppercase tracking-wide">
            {statusBadge}
          </Text>
        </View>
      </View>

      {/* Fila 1: Capataz y Turno/Fecha */}
      <View className="flex-row items-center justify-between">
        {/* Tarjeta Capataz */}
        <View className="flex-1 bg-white rounded-2xl p-3.5 mr-1.5 shadow-sm border border-slate-100">
          <View className="flex-row items-center">
            <User size={13} color="#64748b" strokeWidth={2.2} />
            <Text className="text-slate-500 font-bold text-[10px] tracking-wider uppercase ml-1">
              CAPATAZ
            </Text>
          </View>
          <Text className="text-slate-900 font-extrabold text-sm mt-1.5" numberOfLines={1}>
            {supervisorName}
          </Text>
          <Text className="text-slate-500 text-[11px] font-medium mt-0.5">
            {supervisorId}
          </Text>
        </View>

        {/* Tarjeta Turno / Fecha */}
        <View className="flex-1 bg-white rounded-2xl p-3.5 ml-1.5 shadow-sm border border-slate-100">
          <View className="flex-row items-center">
            <Sun size={13} color="#64748b" strokeWidth={2.2} />
            <Text className="text-slate-500 font-bold text-[10px] tracking-wider uppercase ml-1">
              TURNO / FECHA
            </Text>
          </View>
          <Text className="text-slate-900 font-extrabold text-sm mt-1.5" numberOfLines={1}>
            {shiftName}
          </Text>
          <Text className="text-slate-500 text-[11px] font-medium mt-0.5">
            {shiftDate}
          </Text>
        </View>
      </View>

      {/* Fila 2: Clima Campo y Meta Turno divididos */}
      <View className="bg-white rounded-2xl p-3.5 mt-3 shadow-sm border border-slate-100 flex-row items-center">
        {/* Sub-sección Clima Campo */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-500 font-bold text-[10px] tracking-wider uppercase mb-1">
            CLIMA CAMPO
          </Text>
          <View className="flex-row items-center">
            <Thermometer size={15} color="#dc2626" strokeWidth={2.5} />
            <Text className="text-slate-800 font-extrabold text-xs ml-1">
              {weather}
            </Text>
          </View>
        </View>

        {/* Divisor Vertical */}
        <View className="w-[1px] h-8 bg-slate-200" />

        {/* Sub-sección Meta Turno */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-500 font-bold text-[10px] tracking-wider uppercase mb-1">
            META TURNO
          </Text>
          <View className="flex-row items-center">
            <Package size={15} color="#059669" strokeWidth={2.5} />
            <Text className="text-emerald-700 font-extrabold text-xs ml-1">
              {targetGoal}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InfoGrid;
