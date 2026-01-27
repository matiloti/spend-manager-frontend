import "@testing-library/react-native/extend-expect";

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
      linear: jest.fn((x) => x),
      ease: jest.fn((x) => x),
      out: jest.fn((fn) => fn),
      cubic: jest.fn((x) => x),
      in: jest.fn((fn) => fn),
      inOut: jest.fn((fn) => fn),
    },
  };
});

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

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
    Eye: createMockIcon("Eye"),
    EyeOff: createMockIcon("EyeOff"),
    LogOut: createMockIcon("LogOut"),
    ChevronDown: createMockIcon("ChevronDown"),
    ChevronUp: createMockIcon("ChevronUp"),
    ChevronLeft: createMockIcon("ChevronLeft"),
    ChevronRight: createMockIcon("ChevronRight"),
    Plus: createMockIcon("Plus"),
    X: createMockIcon("X"),
    Wallet: createMockIcon("Wallet"),
    AlertCircle: createMockIcon("AlertCircle"),
    AlertTriangle: createMockIcon("AlertTriangle"),
    TrendingUp: createMockIcon("TrendingUp"),
    TrendingDown: createMockIcon("TrendingDown"),
    Minus: createMockIcon("Minus"),
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
    // Category icons
    Utensils: createMockIcon("Utensils"),
    Car: createMockIcon("Car"),
    ShoppingBag: createMockIcon("ShoppingBag"),
    Film: createMockIcon("Film"),
    Coffee: createMockIcon("Coffee"),
    ShoppingCart: createMockIcon("ShoppingCart"),
    Zap: createMockIcon("Zap"),
    Heart: createMockIcon("Heart"),
    CreditCard: createMockIcon("CreditCard"),
    MoreHorizontal: createMockIcon("MoreHorizontal"),
    Briefcase: createMockIcon("Briefcase"),
    Laptop: createMockIcon("Laptop"),
    Gift: createMockIcon("Gift"),
    Plane: createMockIcon("Plane"),
    Bus: createMockIcon("Bus"),
    Train: createMockIcon("Train"),
    Bike: createMockIcon("Bike"),
    Smartphone: createMockIcon("Smartphone"),
    Wifi: createMockIcon("Wifi"),
    Tv: createMockIcon("Tv"),
    Music: createMockIcon("Music"),
    Book: createMockIcon("Book"),
    GraduationCap: createMockIcon("GraduationCap"),
    Stethoscope: createMockIcon("Stethoscope"),
    Pill: createMockIcon("Pill"),
    Dumbbell: createMockIcon("Dumbbell"),
    Scissors: createMockIcon("Scissors"),
    Shirt: createMockIcon("Shirt"),
    Watch: createMockIcon("Watch"),
    Gem: createMockIcon("Gem"),
    Baby: createMockIcon("Baby"),
    PawPrint: createMockIcon("PawPrint"),
    Wrench: createMockIcon("Wrench"),
    Hammer: createMockIcon("Hammer"),
    Paintbrush: createMockIcon("Paintbrush"),
    Sofa: createMockIcon("Sofa"),
    Bed: createMockIcon("Bed"),
    Bath: createMockIcon("Bath"),
    Droplet: createMockIcon("Droplet"),
    Flame: createMockIcon("Flame"),
    Leaf: createMockIcon("Leaf"),
    TreeDeciduous: createMockIcon("TreeDeciduous"),
    Sun: createMockIcon("Sun"),
    Moon: createMockIcon("Moon"),
    Cloud: createMockIcon("Cloud"),
    Umbrella: createMockIcon("Umbrella"),
    Gamepad2: createMockIcon("Gamepad2"),
    Ticket: createMockIcon("Ticket"),
    Camera: createMockIcon("Camera"),
    Map: createMockIcon("Map"),
    Compass: createMockIcon("Compass"),
    Anchor: createMockIcon("Anchor"),
    Mountain: createMockIcon("Mountain"),
    Banknote: createMockIcon("Banknote"),
    Coins: createMockIcon("Coins"),
    PiggyBank: createMockIcon("PiggyBank"),
    Receipt: createMockIcon("Receipt"),
    Calculator: createMockIcon("Calculator"),
    Building: createMockIcon("Building"),
    Store: createMockIcon("Store"),
    Package: createMockIcon("Package"),
    Truck: createMockIcon("Truck"),
    Calendar: createMockIcon("Calendar"),
    Filter: createMockIcon("Filter"),
    FileText: createMockIcon("FileText"),
    DollarSign: createMockIcon("DollarSign"),
    Hash: createMockIcon("Hash"),
    ArrowUpCircle: createMockIcon("ArrowUpCircle"),
    ArrowDownCircle: createMockIcon("ArrowDownCircle"),
  };
});

// Mock nativewind
jest.mock("nativewind", () => ({
  styled: (component: unknown) => component,
  useColorScheme: () => ({ colorScheme: "light", setColorScheme: jest.fn() }),
}));

// Mock @react-native-community/datetimepicker
jest.mock("@react-native-community/datetimepicker", () => {
  const mockReact = require("react");
  const mockView = require("react-native").View;

  const DateTimePicker = (props: Record<string, unknown>) =>
    mockReact.createElement(mockView, { ...props, testID: props.testID || "date-time-picker" });

  return {
    __esModule: true,
    default: DateTimePicker,
  };
});

// Mock expo-blur
jest.mock("expo-blur", () => {
  const mockReact = require("react");
  const mockView = require("react-native").View;
  return {
    BlurView: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: props.testID || "blur-view" }),
  };
});

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "undetermined", canAskAgain: true })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted", canAskAgain: true })
  ),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve("notification-id")),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
}));

// Mock victory-native charts
jest.mock("victory-native", () => {
  const mockReact = require("react");
  const mockView = require("react-native").View;

  return {
    VictoryPie: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: "victory-pie" }),
    VictoryChart: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: "victory-chart" }),
    VictoryLine: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: "victory-line" }),
    VictoryBar: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: "victory-bar" }),
    VictoryAxis: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, { ...props, testID: "victory-axis" }),
    VictoryTheme: { material: {} },
    VictoryVoronoiContainer: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, props),
    VictoryTooltip: (props: Record<string, unknown>) =>
      mockReact.createElement(mockView, props),
  };
});
