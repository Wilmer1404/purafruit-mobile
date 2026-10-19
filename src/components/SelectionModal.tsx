import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Check, X } from 'lucide-react-native';

export interface SelectionItem {
  id: string | number;
  label: string;
  sublabel?: string;
  badge?: string;
}

export interface SelectionModalProps {
  visible: boolean;
  title: string;
  items: SelectionItem[];
  selectedId?: string | number | null;
  onSelect: (item: SelectionItem) => void;
  onClose: () => void;
}

export const SelectionModal: React.FC<SelectionModalProps> = ({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-slate-950/60 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-[32px] px-5 pt-4 pb-8 max-h-[75%] shadow-2xl">
              <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-3" />

              {/* Encabezado */}
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <Text className="text-slate-900 font-extrabold text-base tracking-wide uppercase">
                  {title}
                </Text>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Lista Desplazable */}
              <ScrollView className="mt-2" showsVerticalScrollIndicator={false}>
                {items.length === 0 ? (
                  <View className="py-8 items-center justify-center">
                    <Text className="text-slate-400 text-sm font-medium text-center">
                      No hay registros disponibles localmente.{'\n'}
                      Presione "Sincronizar Datos" para descargarlos.
                    </Text>
                  </View>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <TouchableOpacity
                        key={String(item.id)}
                        activeOpacity={0.7}
                        onPress={() => onSelect(item)}
                        className={`p-3.5 my-1.5 rounded-2xl flex-row items-center justify-between border ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500'
                            : 'bg-slate-50 border-slate-200/70'
                        }`}
                      >
                        <View className="flex-1 mr-2">
                          <Text
                            className={`font-bold text-sm ${
                              isSelected ? 'text-emerald-900' : 'text-slate-900'
                            }`}
                          >
                            {item.label}
                          </Text>
                          {item.sublabel && (
                            <Text className="text-slate-500 text-xs mt-0.5">
                              {item.sublabel}
                            </Text>
                          )}
                        </View>

                        <View className="flex-row items-center">
                          {item.badge && (
                            <View className="bg-emerald-100 px-2 py-0.5 rounded-full mr-2">
                              <Text className="text-emerald-800 text-[10px] font-bold">
                                {item.badge}
                              </Text>
                            </View>
                          )}
                          {isSelected && <Check size={18} color="#059669" strokeWidth={2.6} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectionModal;
