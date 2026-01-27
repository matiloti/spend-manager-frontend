import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  AccessibilityInfo,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Animation configuration
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.8,
};

const ANIMATION_DURATION = 200;
const STAGGER_DELAY = 100;

// Sizes
const FAB_SIZE = 56;
const OPTION_SIZE = 56;
const OPTION_SPACING = 16;

// Colors from design system
const COLORS = {
  primary: "#3B82F6",
  income: "#22C55E",
  expense: "#EF4444",
  white: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.4)",
};

export interface ExpandableFABProps {
  onAddExpense: () => void;
  onAddIncome: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ExpandableFAB({
  onAddExpense,
  onAddIncome,
  testID,
}: ExpandableFABProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Animation values
  const expandProgress = useSharedValue(0);
  const expenseProgress = useSharedValue(0);
  const incomeProgress = useSharedValue(0);

  // Trigger haptic feedback
  const triggerLightHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const triggerMediumHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  // Expand the FAB menu
  const expand = useCallback(() => {
    setIsExpanded(true);
    triggerLightHaptic();

    // Announce for accessibility
    AccessibilityInfo.announceForAccessibility("Add transaction menu open");

    // Animate in sequence
    expandProgress.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.cubic),
    });

    // Staggered animation for options
    expenseProgress.value = withSpring(1, SPRING_CONFIG);

    setTimeout(() => {
      incomeProgress.value = withSpring(1, SPRING_CONFIG);
    }, STAGGER_DELAY);
  }, [expandProgress, expenseProgress, incomeProgress, triggerLightHaptic]);

  // Collapse the FAB menu
  const collapse = useCallback(() => {
    // Reverse animation (faster)
    incomeProgress.value = withTiming(0, {
      duration: ANIMATION_DURATION * 0.8,
      easing: Easing.in(Easing.cubic),
    });

    setTimeout(() => {
      expenseProgress.value = withTiming(0, {
        duration: ANIMATION_DURATION * 0.8,
        easing: Easing.in(Easing.cubic),
      });
    }, 50);

    setTimeout(() => {
      expandProgress.value = withTiming(0, {
        duration: ANIMATION_DURATION * 0.8,
        easing: Easing.in(Easing.cubic),
      });
      runOnJS(setIsExpanded)(false);
    }, 100);
  }, [expandProgress, expenseProgress, incomeProgress]);

  // Handle FAB press (toggle)
  const handleFABPress = useCallback(() => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  }, [isExpanded, collapse, expand]);

  // Handle option press
  const handleExpensePress = useCallback(() => {
    triggerMediumHaptic();
    collapse();
    // Delay navigation to allow animation to complete
    setTimeout(() => {
      onAddExpense();
    }, 200);
  }, [collapse, onAddExpense, triggerMediumHaptic]);

  const handleIncomePress = useCallback(() => {
    triggerMediumHaptic();
    collapse();
    // Delay navigation to allow animation to complete
    setTimeout(() => {
      onAddIncome();
    }, 200);
  }, [collapse, onAddIncome, triggerMediumHaptic]);

  // Handle backdrop press
  const handleBackdropPress = useCallback(() => {
    collapse();
  }, [collapse]);

  // Animated styles
  const fabRotationStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(expandProgress.value, [0, 1], [0, 45])}deg`,
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: expandProgress.value,
    pointerEvents: expandProgress.value > 0 ? "auto" : "none",
  }));

  const expenseButtonStyle = useAnimatedStyle(() => ({
    opacity: expenseProgress.value,
    transform: [
      {
        translateY: interpolate(
          expenseProgress.value,
          [0, 1],
          [50, 0]
        ),
      },
      {
        scale: interpolate(expenseProgress.value, [0, 1], [0.5, 1]),
      },
    ],
  }));

  const incomeButtonStyle = useAnimatedStyle(() => ({
    opacity: incomeProgress.value,
    transform: [
      {
        translateY: interpolate(
          incomeProgress.value,
          [0, 1],
          [50, 0]
        ),
      },
      {
        scale: interpolate(incomeProgress.value, [0, 1], [0.5, 1]),
      },
    ],
  }));

  return (
    <>
      {/* Blur overlay */}
      {isExpanded && (
        <Animated.View
          style={[styles.overlay, overlayStyle]}
          testID={`${testID}-overlay`}
        >
          <Pressable
            style={styles.backdropPressable}
            onPress={handleBackdropPress}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <BlurView
              intensity={20}
              tint="dark"
              style={styles.blurView}
            />
            <View style={styles.darkOverlay} />
          </Pressable>
        </Animated.View>
      )}

      {/* Options container */}
      {isExpanded && (
        <View style={styles.optionsContainer}>
          {/* Income option (appears second, higher position) */}
          <AnimatedPressable
            style={[styles.optionRow, incomeButtonStyle]}
            onPress={handleIncomePress}
            accessibilityLabel="Add Income"
            accessibilityRole="button"
            accessibilityHint="Navigate to add income screen"
            testID={`${testID}-income`}
          >
            <Text style={styles.optionLabel}>Add Income</Text>
            <View style={[styles.optionButton, styles.incomeButton]}>
              <ArrowUpCircle size={28} color={COLORS.white} />
            </View>
          </AnimatedPressable>

          {/* Expense option (appears first, lower position) */}
          <AnimatedPressable
            style={[styles.optionRow, expenseButtonStyle]}
            onPress={handleExpensePress}
            accessibilityLabel="Add Expense"
            accessibilityRole="button"
            accessibilityHint="Navigate to add expense screen"
            testID={`${testID}-expense`}
          >
            <Text style={styles.optionLabel}>Add Expense</Text>
            <View style={[styles.optionButton, styles.expenseButton]}>
              <ArrowDownCircle size={28} color={COLORS.white} />
            </View>
          </AnimatedPressable>
        </View>
      )}

      {/* Main FAB */}
      <Pressable
        style={styles.fab}
        onPress={handleFABPress}
        accessibilityLabel={isExpanded ? "Close menu" : "Add transaction"}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityHint={isExpanded ? "Tap to close menu" : "Tap to open add transaction options"}
        testID={testID}
      >
        <Animated.View style={fabRotationStyle}>
          <Plus size={28} color={COLORS.white} />
        </Animated.View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 400,
  },
  backdropPressable: {
    flex: 1,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  optionsContainer: {
    position: "absolute",
    bottom: 96 + FAB_SIZE + OPTION_SPACING, // Above the FAB (bottom-24 = 96px)
    right: 16,
    zIndex: 450,
    gap: OPTION_SPACING,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  optionLabel: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  optionButton: {
    width: OPTION_SIZE,
    height: OPTION_SIZE,
    borderRadius: OPTION_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  incomeButton: {
    backgroundColor: COLORS.income,
  },
  expenseButton: {
    backgroundColor: COLORS.expense,
  },
  fab: {
    position: "absolute",
    bottom: 96, // bottom-24 in tailwind (24 * 4 = 96)
    right: 16, // right-4 in tailwind (4 * 4 = 16)
    width: FAB_SIZE,
    height: FAB_SIZE,
    backgroundColor: COLORS.primary,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 500,
  },
});

export default ExpandableFAB;
