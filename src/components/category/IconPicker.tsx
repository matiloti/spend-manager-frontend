import React, { useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, ScrollView, TextInput } from "react-native";
import { Check, Search } from "lucide-react-native";
import { Modal } from "@/components/ui/Modal";
import { CATEGORY_ICONS, getCategoryIcon } from "@/constants/icons";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  label?: string;
  color?: string;
}

export function IconPicker({
  value,
  onChange,
  label,
  color = "#3B82F6",
}: IconPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return CATEGORY_ICONS;
    const query = searchQuery.toLowerCase();
    return CATEGORY_ICONS.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.label.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedIcons = useMemo(() => {
    const groups: Record<string, typeof CATEGORY_ICONS> = {};
    filteredIcons.forEach((icon) => {
      if (!groups[icon.category]) {
        groups[icon.category] = [];
      }
      groups[icon.category].push(icon);
    });
    return groups;
  }, [filteredIcons]);

  const handleSelect = useCallback(
    (iconName: string) => {
      onChange(iconName);
      setModalVisible(false);
      setSearchQuery("");
    },
    [onChange]
  );

  const SelectedIcon = getCategoryIcon(value);

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-3">{label}</Text>
      )}

      <Pressable
        onPress={() => setModalVisible(true)}
        className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl p-3"
        accessibilityLabel="Select icon"
        accessibilityRole="button"
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: color + "20" }}
        >
          <SelectedIcon size={20} color={color} />
        </View>
        <Text className="flex-1 text-base text-gray-900">
          {CATEGORY_ICONS.find((i) => i.name === value)?.label || "Select icon"}
        </Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSearchQuery("");
        }}
        title="Select Icon"
      >
        <View className="mb-4">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search icons..."
              className="flex-1 ml-2 text-base text-gray-900"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <ScrollView className="max-h-80">
          {Object.entries(groupedIcons).map(([category, icons]) => (
            <View key={category} className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 uppercase mb-2">
                {category}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {icons.map((icon) => {
                  const Icon = getCategoryIcon(icon.name);
                  const isSelected = value === icon.name;
                  return (
                    <Pressable
                      key={icon.name}
                      onPress={() => handleSelect(icon.name)}
                      className={`w-12 h-12 rounded-xl items-center justify-center ${
                        isSelected
                          ? "bg-primary-100 border-2 border-primary-500"
                          : "bg-gray-100 active:bg-gray-200"
                      }`}
                      accessibilityLabel={icon.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Icon
                        size={22}
                        color={isSelected ? "#3B82F6" : "#374151"}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
          {filteredIcons.length === 0 && (
            <Text className="text-center text-gray-500 py-8">
              No icons found
            </Text>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

export default IconPicker;
