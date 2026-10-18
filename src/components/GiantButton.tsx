import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Play, ArrowRight } from 'lucide-react-native';

export interface GiantButtonProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const GiantButton: React.FC<GiantButtonProps> = ({
  title,
  subtitle,
  onPress,
  icon,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="bg-[#005c3b] rounded-2xl py-4 px-5 flex-row items-center justify-between shadow-lg shadow-emerald-950/20"
    >
      {/* Círculo con Ícono Play a la Izquierda */}
      <View className="w-13 h-13 w-12 h-12 rounded-full bg-[#008f5d] items-center justify-center">
        {icon ?? <Play size={20} color="#ffffff" fill="#ffffff" />}
      </View>

      {/* Contenedor Central de Texto */}
      <View className="flex-1 ml-4 justify-center">
        <Text
          numberOfLines={1}
          className="text-white font-black text-base tracking-wider uppercase leading-tight"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            numberOfLines={1}
            className="text-emerald-100/90 text-xs font-medium mt-0.5"
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Flecha a la Derecha */}
      <View className="ml-2 items-center justify-center">
        <ArrowRight size={26} color="#6ee7b7" strokeWidth={2.8} />
      </View>
    </TouchableOpacity>
  );
};

export default GiantButton;
