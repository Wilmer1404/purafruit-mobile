import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { supabase } from '../lib/supabase';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      return Alert.alert('Campos requeridos', 'Por favor ingrese su correo y contraseña.');
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) Alert.alert('Error de Autenticación', error.message);
    } catch (err: any) {
      Alert.alert('Error inesperado', err.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar style="dark" />
      <View className="w-full h-1">
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="topLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#E11D2A" />
              <Stop offset="60%" stopColor="#E11D2A" />
              <Stop offset="100%" stopColor="#15803D" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#topLine)" />
        </Svg>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 18 }}
            keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center max-w-sm w-full self-center">
              <View className="items-center mb-6">
                <Image source={require('../../assets/purafruit-logo.png')} className="w-56 h-16 mb-2" resizeMode="contain" />
                <Text className="text-slate-600 font-bold text-sm tracking-wider uppercase">PANEL DE CONTROL GERENCIAL</Text>
                <View className="bg-blue-50/80 border border-blue-100 rounded-full py-1 px-3.5 flex-row items-center mt-2.5">
                  <ShieldCheck size={14} color="#059669" strokeWidth={2.4} />
                  <Text className="text-slate-600 font-semibold text-xs ml-1.5">Acceso Seguro • Telemetría Agrícola</Text>
                </View>
              </View>

              <View className="w-full">
                <Text className="text-xs font-bold text-slate-700 tracking-wider mb-1.5 uppercase">CORREO ELECTRÓNICO</Text>
                <View className="bg-[#FEFCE8] rounded-xl px-3.5 py-3 flex-row items-center border border-slate-200 mb-4">
                  <Mail size={18} color="#94a3b8" strokeWidth={2} />
                  <TextInput
                    value={email} onChangeText={setEmail} placeholder="admin@purafruit.com"
                    placeholderTextColor="#94a3b8" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                    className="flex-1 text-slate-900 font-medium text-base ml-2.5"
                  />
                </View>

                <Text className="text-xs font-bold text-slate-700 tracking-wider mb-1.5 uppercase">CONTRASEÑA</Text>
                <View className="bg-[#FEFCE8] rounded-xl px-3.5 py-3 flex-row items-center border border-slate-200 mb-6">
                  <Lock size={18} color="#94a3b8" strokeWidth={2} />
                  <TextInput
                    value={password} onChangeText={setPassword} placeholder="••••••••••••"
                    placeholderTextColor="#94a3b8" secureTextEntry={!showPassword} autoCapitalize="none"
                    className="flex-1 text-slate-900 font-medium text-base ml-2.5"
                  />
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)} className="p-1">
                    {showPassword ? <EyeOff size={18} color="#94a3b8" strokeWidth={2} /> : <Eye size={18} color="#94a3b8" strokeWidth={2} />}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.88} disabled={loading} onPress={handleSignIn} className="rounded-xl overflow-hidden shadow-xl shadow-rose-600/30">
                  <View className="py-3.5 justify-center items-center relative rounded-xl overflow-hidden">
                    <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
                      <Defs>
                        <LinearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <Stop offset="0%" stopColor="#DC2626" />
                          <Stop offset="55%" stopColor="#B91C1C" />
                          <Stop offset="75%" stopColor="#7E7238" />
                          <Stop offset="100%" stopColor="#15803D" />
                        </LinearGradient>
                      </Defs>
                      <Rect width="100%" height="100%" fill="url(#btnGrad)" rx={12} />
                    </Svg>
                    {loading ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white font-bold text-base mr-2">Iniciar Sesión</Text>
                        <ArrowRight size={18} color="#ffffff" strokeWidth={2.4} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="w-full items-center mt-6">
              <View className="w-full h-[1px] bg-slate-100 mb-3" />
              <Text className="text-slate-400 text-[11px] text-center font-medium">
                PuraFruit Company • Campaña 2026 • Protección de Datos SSL
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
