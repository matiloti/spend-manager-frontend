import React from "react";
import { View, ScrollView } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";

export function StatisticsSkeleton() {
  return (
    <View className="flex-1">
      {/* Date Range Selector Skeleton */}
      <View className="px-4 pt-4">
        <Skeleton height={44} borderRadius={12} />
      </View>

      {/* Account Filter Skeleton */}
      <View className="px-4 pt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <Skeleton width={100} height={36} borderRadius={16} />
            <Skeleton width={120} height={36} borderRadius={16} />
            <Skeleton width={90} height={36} borderRadius={16} />
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* KPI Cards Skeleton */}
        <View className="px-4 pt-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="w-[140px] bg-bg-elevated rounded-card shadow-card p-4"
              >
                <Skeleton width={60} height={12} borderRadius={4} />
                <View className="mt-2">
                  <Skeleton width={100} height={24} borderRadius={4} />
                </View>
                <View className="mt-2">
                  <Skeleton width={50} height={16} borderRadius={4} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Secondary KPI Cards Skeleton */}
        <View className="px-4 pt-4 flex-row gap-3">
          <View className="flex-1 bg-bg-elevated rounded-card shadow-card p-4 flex-row items-center justify-between">
            <Skeleton width={100} height={16} borderRadius={4} />
            <Skeleton width={40} height={20} borderRadius={4} />
          </View>
          <View className="flex-1 bg-bg-elevated rounded-card shadow-card p-4 flex-row items-center justify-between">
            <Skeleton width={80} height={16} borderRadius={4} />
            <Skeleton width={50} height={20} borderRadius={4} />
          </View>
        </View>

        {/* Comparison Cards Skeleton */}
        <View className="px-4 pt-6 flex-row gap-3">
          {[1, 2].map((i) => (
            <View
              key={i}
              className="flex-1 bg-bg-elevated rounded-card shadow-card p-4"
            >
              <Skeleton width={100} height={12} borderRadius={4} />
              <View className="mt-3">
                <Skeleton width={80} height={20} borderRadius={4} />
              </View>
              <View className="mt-3">
                <Skeleton height={8} borderRadius={4} />
              </View>
              <View className="mt-2">
                <Skeleton height={8} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>

        {/* Donut Chart Skeleton */}
        <View className="px-4 pt-6 items-center">
          <Skeleton width={200} height={200} borderRadius={100} />
        </View>

        {/* Legend Skeleton */}
        <View className="px-4 pt-4 flex-row flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="w-1/2 flex-row items-center px-2 py-2">
              <Skeleton width={12} height={12} borderRadius={6} />
              <View className="ml-2 flex-1">
                <Skeleton width="80%" height={14} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>

        {/* Time Series Chart Skeleton */}
        <View className="px-4 pt-6">
          <View className="bg-bg-elevated rounded-card shadow-card p-4">
            <View className="flex-row justify-end mb-4">
              <Skeleton width={80} height={36} borderRadius={8} />
            </View>
            <Skeleton height={200} borderRadius={8} />
          </View>
        </View>

        {/* Top Categories Skeleton */}
        <View className="px-4 pt-6">
          <View className="bg-bg-elevated rounded-card shadow-card overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className={`p-4 ${i < 5 ? "border-b border-border-subtle" : ""}`}
              >
                <View className="flex-row items-center">
                  <Skeleton width={24} height={24} borderRadius={12} />
                  <View className="ml-2">
                    <Skeleton width={32} height={32} borderRadius={16} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Skeleton width="60%" height={16} borderRadius={4} />
                  </View>
                  <Skeleton width={70} height={16} borderRadius={4} />
                </View>
                <View className="mt-2 ml-8">
                  <Skeleton height={8} borderRadius={4} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default StatisticsSkeleton;
