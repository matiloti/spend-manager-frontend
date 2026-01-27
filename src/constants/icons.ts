import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Coffee,
  ShoppingCart,
  Zap,
  Heart,
  CreditCard,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Gift,
  TrendingUp,
  Home,
  Plane,
  Bus,
  Train,
  Bike,
  Smartphone,
  Wifi,
  Tv,
  Music,
  Book,
  GraduationCap,
  Stethoscope,
  Pill,
  Dumbbell,
  Scissors,
  Shirt,
  Watch,
  Gem,
  Baby,
  PawPrint,
  Wrench,
  Hammer,
  Paintbrush,
  Sofa,
  Bed,
  Bath,
  Droplet,
  Flame,
  Leaf,
  TreeDeciduous,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Gamepad2,
  Ticket,
  Camera,
  Map,
  Compass,
  Anchor,
  Mountain,
  Wallet,
  Banknote,
  Coins,
  PiggyBank,
  Receipt,
  Calculator,
  Building,
  Store,
  Package,
  Truck,
  type LucideIcon,
} from "lucide-react-native";

export interface CategoryIconItem {
  name: string;
  label: string;
  category: string;
}

// Predefined icons for categories matching the API specification
export const CATEGORY_ICONS: CategoryIconItem[] = [
  // Food
  { name: "utensils", label: "Utensils", category: "food" },
  { name: "coffee", label: "Coffee", category: "food" },
  { name: "shopping-cart", label: "Shopping Cart", category: "food" },

  // Transport
  { name: "car", label: "Car", category: "transport" },
  { name: "bus", label: "Bus", category: "transport" },
  { name: "train", label: "Train", category: "transport" },
  { name: "plane", label: "Plane", category: "transport" },
  { name: "bike", label: "Bike", category: "transport" },

  // Shopping
  { name: "shopping-bag", label: "Shopping Bag", category: "shopping" },
  { name: "shirt", label: "Clothing", category: "shopping" },
  { name: "watch", label: "Accessories", category: "shopping" },
  { name: "gem", label: "Jewelry", category: "shopping" },
  { name: "smartphone", label: "Electronics", category: "shopping" },

  // Entertainment
  { name: "film", label: "Movies", category: "entertainment" },
  { name: "music", label: "Music", category: "entertainment" },
  { name: "gamepad-2", label: "Gaming", category: "entertainment" },
  { name: "ticket", label: "Events", category: "entertainment" },
  { name: "tv", label: "TV", category: "entertainment" },
  { name: "camera", label: "Photography", category: "entertainment" },

  // Finance
  { name: "credit-card", label: "Credit Card", category: "finance" },
  { name: "wallet", label: "Wallet", category: "finance" },
  { name: "banknote", label: "Cash", category: "finance" },
  { name: "coins", label: "Coins", category: "finance" },
  { name: "piggy-bank", label: "Savings", category: "finance" },
  { name: "trending-up", label: "Investment", category: "finance" },
  { name: "receipt", label: "Bills", category: "finance" },
  { name: "calculator", label: "Calculator", category: "finance" },

  // Health
  { name: "heart", label: "Health", category: "health" },
  { name: "stethoscope", label: "Medical", category: "health" },
  { name: "pill", label: "Medicine", category: "health" },
  { name: "dumbbell", label: "Fitness", category: "health" },
  { name: "scissors", label: "Beauty", category: "health" },

  // Home
  { name: "home", label: "Home", category: "home" },
  { name: "sofa", label: "Furniture", category: "home" },
  { name: "bed", label: "Bedroom", category: "home" },
  { name: "bath", label: "Bathroom", category: "home" },
  { name: "wrench", label: "Maintenance", category: "home" },
  { name: "hammer", label: "Repairs", category: "home" },
  { name: "paintbrush", label: "Decor", category: "home" },
  { name: "zap", label: "Electricity", category: "home" },
  { name: "droplet", label: "Water", category: "home" },
  { name: "flame", label: "Gas", category: "home" },
  { name: "wifi", label: "Internet", category: "home" },

  // Work
  { name: "briefcase", label: "Briefcase", category: "work" },
  { name: "laptop", label: "Laptop", category: "work" },
  { name: "building", label: "Office", category: "work" },
  { name: "store", label: "Business", category: "work" },
  { name: "package", label: "Package", category: "work" },
  { name: "truck", label: "Delivery", category: "work" },

  // Education
  { name: "book", label: "Books", category: "education" },
  { name: "graduation-cap", label: "Education", category: "education" },

  // Travel
  { name: "map", label: "Maps", category: "travel" },
  { name: "compass", label: "Compass", category: "travel" },
  { name: "mountain", label: "Outdoors", category: "travel" },
  { name: "anchor", label: "Cruise", category: "travel" },
  { name: "umbrella", label: "Vacation", category: "travel" },

  // Family
  { name: "baby", label: "Baby", category: "family" },
  { name: "paw-print", label: "Pets", category: "family" },
  { name: "gift", label: "Gifts", category: "family" },

  // Other
  { name: "more-horizontal", label: "Other", category: "other" },
  { name: "leaf", label: "Nature", category: "other" },
  { name: "sun", label: "Sun", category: "other" },
  { name: "moon", label: "Moon", category: "other" },
  { name: "cloud", label: "Cloud", category: "other" },
];

// Icon name to component mapping
const ICON_MAP: Record<string, LucideIcon> = {
  "utensils": Utensils,
  "car": Car,
  "shopping-bag": ShoppingBag,
  "film": Film,
  "coffee": Coffee,
  "shopping-cart": ShoppingCart,
  "zap": Zap,
  "heart": Heart,
  "credit-card": CreditCard,
  "more-horizontal": MoreHorizontal,
  "briefcase": Briefcase,
  "laptop": Laptop,
  "gift": Gift,
  "trending-up": TrendingUp,
  "home": Home,
  "plane": Plane,
  "bus": Bus,
  "train": Train,
  "bike": Bike,
  "smartphone": Smartphone,
  "wifi": Wifi,
  "tv": Tv,
  "music": Music,
  "book": Book,
  "graduation-cap": GraduationCap,
  "stethoscope": Stethoscope,
  "pill": Pill,
  "dumbbell": Dumbbell,
  "scissors": Scissors,
  "shirt": Shirt,
  "watch": Watch,
  "gem": Gem,
  "baby": Baby,
  "paw-print": PawPrint,
  "wrench": Wrench,
  "hammer": Hammer,
  "paintbrush": Paintbrush,
  "sofa": Sofa,
  "bed": Bed,
  "bath": Bath,
  "droplet": Droplet,
  "flame": Flame,
  "leaf": Leaf,
  "tree-deciduous": TreeDeciduous,
  "sun": Sun,
  "moon": Moon,
  "cloud": Cloud,
  "umbrella": Umbrella,
  "gamepad-2": Gamepad2,
  "ticket": Ticket,
  "camera": Camera,
  "map": Map,
  "compass": Compass,
  "anchor": Anchor,
  "mountain": Mountain,
  "wallet": Wallet,
  "banknote": Banknote,
  "coins": Coins,
  "piggy-bank": PiggyBank,
  "receipt": Receipt,
  "calculator": Calculator,
  "building": Building,
  "store": Store,
  "package": Package,
  "truck": Truck,
};

/**
 * Get the Lucide icon component for a given icon name
 */
export function getCategoryIcon(name: string): LucideIcon {
  return ICON_MAP[name] || MoreHorizontal;
}

/**
 * Get icon categories for grouping
 */
export const ICON_CATEGORIES = [
  "food",
  "transport",
  "shopping",
  "entertainment",
  "finance",
  "health",
  "home",
  "work",
  "education",
  "travel",
  "family",
  "other",
];
