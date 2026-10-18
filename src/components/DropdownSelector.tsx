import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

export interface DropdownSelectorProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  value: string;
  status?: string;
  onPress: () => void;
  headerIcon?: React.ReactNode;
  badgeText?: string;
  badgeVariant?: 'emerald' | 'blue';
  statusIcon?: React.ReactNode;
  statusColor?: string;
  iconBgColor?: string;
}

export const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  title,
  subtitle,
  icon,
  value,
  status,
  onPress,
  headerIcon,
  badgeText,
  badgeVariant = 'emerald',
  statusIcon,
  statusColor = 'text-emerald-700',
  iconBgColor = 'bg-emerald-700',
}) => {
  const isEmeraldBadge = badgeVariant === 'emerald';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3.5 shadow-sm border border-slate-100"
    >
      {/* Fila Superior: Título con Ícono y Píldora de Estado/Contador */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-1.5">
          {headerIcon && <View className="mr-1.5">{headerIcon}</View>}
          <Text className="text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
            {title}
          </Text>
        </View>

        {badgeText && (
          <View
            className={`px-3 py-1 rounded-full ${
              isEmeraldBadge ? 'bg-emerald-100' : 'bg-blue-100'
            }`}
          >
            <Text
              className={`text-[11px] font-bold ${
                isEmeraldBadge ? 'text-emerald-800' : 'text-blue-800'
              }`}
            >
              {badgeText}
            </Text>
          </View>
        )}
      </View>

      {/* Fila Principal de Selección */}
      <View className="flex-row items-center justify-between">
        {/* Ícono de Gran Formato a la Izquierda */}
        <View
          className={`w-14 h-14 rounded-2xl items-center justify-center ${iconBgColor}`}
        >
          {icon}
        </View>

        {/* Textos de Valor y Subtítulo / Estado */}
        <View className="flex-1 ml-3.5 justify-center">
          <Text
            numberOfLines={1}
            className="text-slate-900 font-bold text-base tracking-tight"
          >
            {value}
          </Text>

          {(subtitle || status) && (
            <View className="flex-row items-center mt-1">
              {statusIcon && <View className="mr-1">{statusIcon}</View>}
              <Text
                numberOfLines={1}
                className={`text-xs font-semibold ${statusColor}`}
              >
                {subtitle ?? status}
              </Text>
            </View>
          )}
        </View>

        {/* Flecha Desplegable a la Derecha */}
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center ml-2">
          <ChevronDown size={20} color="#475569" strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DropdownSelector;
