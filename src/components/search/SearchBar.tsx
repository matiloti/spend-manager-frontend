import React, { forwardRef, useCallback } from "react";
import { View, TextInput, Pressable, TextInputProps } from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  testID?: string;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(
  ({ value, onChangeText, onClear, testID, ...props }, ref) => {
    const handleClear = useCallback(() => {
      onChangeText("");
      onClear?.();
    }, [onChangeText, onClear]);

    return (
      <View
        className="flex-row items-center bg-gray-100 rounded-xl px-4 h-12"
        testID={testID}
      >
        <Search size={20} color="#6B7280" />
        <TextInput
          ref={ref}
          className="flex-1 ml-3 text-base text-gray-900"
          value={value}
          onChangeText={onChangeText}
          placeholder="Search transactions..."
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Search transactions"
          testID={testID ? `${testID}-input` : undefined}
          {...props}
        />
        {value.length > 0 && (
          <Pressable
            onPress={handleClear}
            className="p-1 rounded-full active:bg-gray-200"
            hitSlop={8}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            testID={testID ? `${testID}-clear` : undefined}
          >
            <X size={18} color="#6B7280" />
          </Pressable>
        )}
      </View>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
