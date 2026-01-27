import "@testing-library/jest-native/extend-expect";

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: "Link",
}));

// Mock react-native-gesture-handler
jest.mock("react-native-gesture-handler", () => {
  const mockView = require("react-native").View;
  return {
    GestureHandlerRootView: mockView,
    PanGestureHandler: mockView,
    State: {},
    Directions: {},
  };
});

// Mock @react-native-async-storage/async-storage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const mockReanimated = require("react-native-reanimated/mock");
  return {
    ...mockReanimated,
    useAnimatedStyle: jest.fn(() => ({})),
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    withTiming: jest.fn((value) => value),
    withSpring: jest.fn((value) => value),
    runOnJS: jest.fn((fn) => fn),
    useAnimatedGestureHandler: jest.fn(),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
    },
  };
});

// Mock lucide-react-native icons
jest.mock("lucide-react-native", () => {
  const mockReact = require("react");
  const mockView = require("react-native").View;

  const createMockIcon = (name: string) => {
    return (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: `${name}-icon` });
  };

  return {
    Check: createMockIcon("Check"),
    ChevronDown: createMockIcon("ChevronDown"),
    ChevronLeft: createMockIcon("ChevronLeft"),
    ChevronRight: createMockIcon("ChevronRight"),
    Plus: createMockIcon("Plus"),
    X: createMockIcon("X"),
    Wallet: createMockIcon("Wallet"),
    AlertCircle: createMockIcon("AlertCircle"),
    AlertTriangle: createMockIcon("AlertTriangle"),
    TrendingUp: createMockIcon("TrendingUp"),
    TrendingDown: createMockIcon("TrendingDown"),
    Edit3: createMockIcon("Edit3"),
    Trash2: createMockIcon("Trash2"),
    CheckCircle: createMockIcon("CheckCircle"),
    FolderOpen: createMockIcon("FolderOpen"),
    Tag: createMockIcon("Tag"),
    User: createMockIcon("User"),
    Bell: createMockIcon("Bell"),
    Shield: createMockIcon("Shield"),
    Home: createMockIcon("Home"),
    Search: createMockIcon("Search"),
    BarChart3: createMockIcon("BarChart3"),
    Settings: createMockIcon("Settings"),
  };
});

// Mock nativewind
jest.mock("nativewind", () => ({
  styled: (component: unknown) => component,
  useColorScheme: () => ({ colorScheme: "light", setColorScheme: jest.fn() }),
}));
