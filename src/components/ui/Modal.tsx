import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  ModalProps as RNModalProps,
} from "react-native";
import { X } from "lucide-react-native";

interface ModalProps extends Omit<RNModalProps, "children"> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-4"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                {title || ""}
              </Text>
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  className="p-1 rounded-full active:bg-gray-100"
                  accessibilityLabel="Close modal"
                  accessibilityRole="button"
                >
                  <X size={24} color="#6B7280" />
                </Pressable>
              )}
            </View>
          )}
          <View className="p-4">{children}</View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

export default Modal;
