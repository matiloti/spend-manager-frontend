import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  ModalProps as RNModalProps,
  StyleSheet,
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
        style={styles.backdrop}
        className="flex-1 bg-black/50 justify-center items-center px-4"
        onPress={onClose}
      >
        <Pressable
          style={styles.container}
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          {(title || showCloseButton) && (
            <View
              style={styles.header}
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
            >
              <Text
                style={styles.title}
                className="text-lg font-semibold text-gray-900"
              >
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
          <View style={styles.content} className="p-4">
            {children}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

// Fallback styles to ensure Modal works even if NativeWind fails
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 448,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  content: {
    padding: 16,
  },
});

export default Modal;
