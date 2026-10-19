import React from 'react';
import { View, Text, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Cpu, LogOut } from 'lucide-react-native';

export interface HeaderStatusProps {
  terminalCode?: string;
  terminalVersion?: string;
  statusText?: string;
  logoSource?: ImageSourcePropType;
  onLogout?: () => void;
}

export const HeaderStatus: React.FC<HeaderStatusProps> = ({
  terminalCode = 'TERMINAL',
  terminalVersion = 'V3.8',
  statusText = 'CONECTADO /\nSINCRONIZADO',
  logoSource = require('../../assets/purafruit-logo.png'),
  onLogout,
}) => {
  return (
    <View className="w-full mb-3">
      {/* Fila Superior de Píldoras de Estado */}
      <View className="flex-row items-center justify-between w-full px-1">
        {/* Píldora Terminal Izquierda */}
        <View className="flex-row items-center bg-[#DCE8FE] px-4 py-2 rounded-full shadow-xs">
          <Cpu size={18} color="#1e3a8a" strokeWidth={2.2} />
          <View className="ml-2">
            <Text className="text-[10px] font-black tracking-wider text-blue-950 uppercase leading-3">
              {terminalCode}
            </Text>
            <Text className="text-[11px] font-black tracking-wider text-blue-900 leading-3 mt-0.5">
              {terminalVersion}
            </Text>
          </View>
        </View>

        {/* Píldora Sincronización Derecha y Botón Logout */}
        <View className="flex-row items-center">
          <View className="flex-row items-center bg-[#86EFAC] px-3.5 py-2 rounded-full shadow-xs">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-900 mr-2" />
            <Text className="text-[10px] font-black tracking-wider text-emerald-950 uppercase leading-3">
              {statusText}
            </Text>
          </View>

          {onLogout && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onLogout}
              className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200/90 items-center justify-center ml-2 shadow-xs"
            >
              <LogOut size={17} color="#e11d48" strokeWidth={2.3} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Espacio Central para Logo Corporativo */}
      <View className="items-center justify-center my-3">
        {logoSource ? (
          <Image
            source={logoSource}
            style={{ width: 170, height: 50 }}
            resizeMode="contain"
            accessibilityLabel="PuraFruit Logo"
          />
        ) : (
          <View className="items-center">
            <View className="flex-row items-baseline">
              <Text className="text-3xl font-extrabold text-[#E11D48]">pura</Text>
              <Text className="text-3xl font-extrabold text-[#059669]">fruit</Text>
            </View>
            <Text className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase mt-0.5">
              COMPANY
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HeaderStatus;
