import React, { useEffect, useRef } from "react";
import { View, Animated, ViewProps, DimensionValue } from "react-native";

interface SkeletonProps extends ViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
  ...props
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E5E7EB",
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl p-4 border border-gray-100">
      <View className="flex-row items-center gap-3">
        <Skeleton width={48} height={48} borderRadius={24} />
        <View className="flex-1 gap-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </View>
        <Skeleton width={80} height={20} />
      </View>
    </View>
  );
}

export default Skeleton;
