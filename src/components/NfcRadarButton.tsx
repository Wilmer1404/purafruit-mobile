import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Nfc, Radio } from 'lucide-react-native';

export interface NfcRadarButtonProps {
  onPress?: () => void;
  instructionText?: string;
  proximityText?: string;
}

export const NfcRadarButton: React.FC<NfcRadarButtonProps> = ({
  onPress,
  instructionText = 'Acerque la tarjeta NFC del trabajador al reverso del teléfono',
  proximityText = 'Lectura automática por proximidad (1-4 cm)',
}) => {
  return (
    <View className="w-full bg-white rounded-3xl p-6 items-center shadow-sm border border-slate-100 my-3">
      {/* Círculo Interactivo con Halo de Radar */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        className="items-center justify-center"
      >
        {/* Halo Exterior */}
        <View className="w-64 h-64 rounded-full bg-emerald-50 items-center justify-center">
          {/* Halo Intermedio */}
          <View className="w-52 h-52 rounded-full bg-[#d1fae5] items-center justify-center">
            {/* Núcleo Central Masivo NFC */}
            <View className="w-36 h-36 rounded-full bg-[#00875a] items-center justify-center shadow-xl shadow-emerald-900/30">
              <Nfc size={44} color="#ffffff" strokeWidth={2.4} />
              <Text className="text-white font-black text-xs tracking-widest uppercase mt-1">
                NFC
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Texto Descriptivo Principal */}
      <Text className="text-slate-900 font-extrabold text-center text-base px-2 mt-5 leading-6">
        {instructionText}
      </Text>

      {/* Píldora Informativa de Rango de Proximidad */}
      <View className="bg-[#DCE8FE] px-4 py-2 rounded-full flex-row items-center mt-4">
        <Radio size={15} color="#1e3a8a" strokeWidth={2.5} />
        <Text className="text-slate-800 text-xs font-bold ml-2">
          {proximityText}
        </Text>
      </View>
    </View>
  );
};

export default NfcRadarButton;
