import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingrese su correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Error de Autenticación', error.message);
      }
    } catch (err: any) {
      Alert.alert('Error inesperado', err.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900" style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-6" style={{ flex: 1, justifyContent: 'center' }}>
            {/* Header / Branding */}
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-white tracking-wider" style={{ color: '#ffffff' }}>
                🌱 PURAFRUIT
              </Text>
              <Text className="text-emerald-500 font-bold text-base tracking-widest uppercase mt-2" style={{ color: '#10b981' }}>
                Terminal de Capataz
              </Text>
              <Text className="text-slate-400 text-xs mt-1 text-center" style={{ color: '#94a3b8' }}>
                Sistema Móvil de Gestión de Cosecha & NFC
              </Text>
            </View>

            {/* Formulario */}
            <View className="space-y-4">
              {/* Input Correo */}
              <View className="bg-slate-800 rounded-2xl px-4 py-3.5 flex-row items-center border border-slate-700/80 mb-3.5">
                <Mail size={20} color="#94a3b8" strokeWidth={2.2} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="correo@purafruit.com"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-white text-base ml-3"
                  style={{ color: '#ffffff' }}
                />
              </View>

              {/* Input Contraseña */}
              <View className="bg-slate-800 rounded-2xl px-4 py-3.5 flex-row items-center border border-slate-700/80 mb-6">
                <Lock size={20} color="#94a3b8" strokeWidth={2.2} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Contraseña"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="flex-1 text-white text-base ml-3"
                  style={{ color: '#ffffff' }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="p-1"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#94a3b8" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#94a3b8" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Botón Masivo de Ingreso */}
              <TouchableOpacity
                activeOpacity={0.85}
                disabled={loading}
                onPress={handleSignIn}
                className="bg-[#00875a] rounded-2xl py-4 flex-row items-center justify-center shadow-lg shadow-emerald-950/40"
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <View className="flex-row items-center justify-center">
                    <LogIn size={20} color="#ffffff" strokeWidth={2.6} />
                    <Text className="text-white font-bold text-base uppercase tracking-wider ml-2" style={{ color: '#ffffff' }}>
                      Ingresar al Sistema
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Corporativo */}
            <View className="mt-12 items-center">
              <Text className="text-slate-500 text-xs" style={{ color: '#64748b' }}>
                PuraFruit Company • Versión 3.8
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
