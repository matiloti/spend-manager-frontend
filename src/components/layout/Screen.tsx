import React from "react";
import { SafeAreaView, View, ViewProps, ScrollView } from "react-native";

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  backgroundColor?: string;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  backgroundColor = "#FFFFFF",
  style,
  ...props
}: ScreenProps) {
  const content = (
    <View
      className={`flex-1 ${padded ? "px-4" : ""}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor }}
    >
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export default Screen;
