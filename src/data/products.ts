import { ShoppingBag, Smartphone, Laptop, Keyboard, Headphones, Watch, Home, type LucideIcon } from "lucide-react";

export type ProductCategory = "smartphones" | "laptops" | "accessories" | "audio" | "wearables" | "smart-home" | string;

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  badge?: "new" | "sale" | "hot" | "limited";
}

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  productCount?: number;
  order: number;
  active: boolean;
}

// Icon library — admins can pick from any of these
export const AVAILABLE_ICONS: { name: string; icon: LucideIcon; category: string }[] = [
  { name: "ShoppingBag", icon: ShoppingBag, category: "general" },
  { name: "Smartphone", icon: Smartphone, category: "electronics" },
  { name: "Laptop", icon: Laptop, category: "electronics" },
  { name: "Keyboard", icon: Keyboard, category: "electronics" },
  { name: "Headphones", icon: Headphones, category: "electronics" },
  { name: "Watch", icon: Watch, category: "electronics" },
  { name: "Home", icon: Home, category: "general" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "all", label: "All Products", icon: ShoppingBag, description: "Show products from all categories", order: 0, active: true },
  { id: "smartphones", label: "Smartphones", icon: Smartphone, description: "Mobile phones and accessories", order: 1, active: true },
  { id: "laptops", label: "Laptops", icon: Laptop, description: "Portable computers and notebooks", order: 2, active: true },
  { id: "accessories", label: "Accessories", icon: Keyboard, description: "Computer peripherals and accessories", order: 3, active: true },
  { id: "audio", label: "Audio", icon: Headphones, description: "Headphones, speakers, and audio gear", order: 4, active: true },
  { id: "wearables", label: "Wearables", icon: Watch, description: "Smart watches and fitness trackers", order: 5, active: true },
  { id: "smart-home", label: "Smart Home", icon: Home, description: "Smart home devices and automation", order: 6, active: true },
];

// Backwards compatibility — exports CATEGORIES as a derived list
export const CATEGORIES = DEFAULT_CATEGORIES.map(({ id, label, icon }) => ({ id, label, icon }));

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro Max",
    category: "smartphones",
    categoryLabel: "Smartphones",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, and ProRAW camera system.",
    features: ["6.7\" Super Retina XDR", "A17 Pro Chip", "48MP Main Camera", "Titanium Body", "USB-C"],
    inStock: true,
    rating: 4.9,
    reviews: 248,
    badge: "hot",
  },
  {
    id: "p2",
    name: "Samsung Galaxy S24 Ultra",
    category: "smartphones",
    categoryLabel: "Smartphones",
    price: 1099,
    image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Samsung Galaxy S24 Ultra with Galaxy AI, S Pen, and 200MP camera.",
    features: ["6.8\" Dynamic AMOLED 2X", "Snapdragon 8 Gen 3", "200MP Camera", "S Pen Included", "5000mAh"],
    inStock: true,
    rating: 4.8,
    reviews: 187,
    badge: "new",
  },
  {
    id: "p3",
    name: "MacBook Pro 16\" M3 Max",
    category: "laptops",
    categoryLabel: "Laptops",
    price: 3499,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Apple MacBook Pro 16-inch with M3 Max chip for ultimate performance.",
    features: ["16\" Liquid Retina XDR", "M3 Max Chip", "36GB Unified Memory", "1TB SSD", "22hr Battery"],
    inStock: true,
    rating: 5.0,
    reviews: 96,
    badge: "limited",
  },
  {
    id: "p4",
    name: "Dell XPS 15",
    category: "laptops",
    categoryLabel: "Laptops",
    price: 1599,
    originalPrice: 1799,
    image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Dell XPS 15 with InfinityEdge display and powerful Intel Core i7 processor.",
    features: ["15.6\" 4K OLED", "Intel Core i7-13700H", "16GB DDR5 RAM", "512GB SSD", "NVIDIA RTX 4050"],
    inStock: true,
    rating: 4.6,
    reviews: 142,
    badge: "sale",
  },
  {
    id: "p5",
    name: "AirPods Pro (2nd Gen)",
    category: "audio",
    categoryLabel: "Audio",
    price: 249,
    image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Apple AirPods Pro with active noise cancellation and spatial audio.",
    features: ["Active Noise Cancellation", "Adaptive Transparency", "Spatial Audio", "6hr Battery + 30hr Case", "MagSafe Case"],
    inStock: true,
    rating: 4.8,
    reviews: 312,
    badge: "hot",
  },
  {
    id: "p6",
    name: "Sony WH-1000XM5",
    category: "audio",
    categoryLabel: "Audio",
    price: 399,
    originalPrice: 449,
    image: "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Sony WH-1000XM5 wireless noise-cancelling headphones with 30hr battery.",
    features: ["Industry-leading ANC", "30hr Battery Life", "Multi-point Connection", "LDAC Hi-Res Audio", "Speak-to-Chat"],
    inStock: true,
    rating: 4.9,
    reviews: 198,
    badge: "sale",
  },
  {
    id: "p7",
    name: "Apple Watch Series 9",
    category: "wearables",
    categoryLabel: "Wearables",
    price: 449,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Apple Watch Series 9 with new S9 chip and Double Tap gesture.",
    features: ["45mm Case", "S9 SiP Chip", "Always-On Display", "ECG + Blood Oxygen", "GPS + Cellular"],
    inStock: true,
    rating: 4.7,
    reviews: 256,
    badge: "new",
  },
  {
    id: "p8",
    name: "Samsung Galaxy Watch 6",
    category: "wearables",
    categoryLabel: "Wearables",
    price: 329,
    image: "https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Samsung Galaxy Watch 6 Classic with rotating bezel and Wear OS.",
    features: ["47mm Classic", "Wear OS by Google", "BioActive Sensor", "Sapphire Crystal", "40hr Battery"],
    inStock: true,
    rating: 4.5,
    reviews: 89,
  },
  {
    id: "p9",
    name: "Logitech MX Master 3S",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 99,
    image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Logitech MX Master 3S wireless performance mouse with quiet clicks.",
    features: ["8K DPI Sensor", "Quiet Clicks", "70-day Battery", "Multi-device Flow", "USB-C Charging"],
    inStock: true,
    rating: 4.8,
    reviews: 421,
    badge: "hot",
  },
  {
    id: "p10",
    name: "Keychron K8 Pro",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 169,
    image: "https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Keychron K8 Pro QMK/VIA wireless mechanical keyboard with hot-swappable switches.",
    features: ["QMK/VIA Customizable", "Hot-swappable", "Wireless & Wired", "75% Layout", "Mac/Windows"],
    inStock: false,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "p11",
    name: "Google Nest Hub Max",
    category: "smart-home",
    categoryLabel: "Smart Home",
    price: 229,
    originalPrice: 279,
    image: "https://images.pexels.com/photos/4318841/pexels-photo-4318841.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Google Nest Hub Max with 10\" HD display, Nest Cam, and Google Assistant.",
    features: ["10\" HD Smart Display", "Built-in Nest Cam", "Google Assistant", "Stereo Speakers", "Face Match"],
    inStock: true,
    rating: 4.4,
    reviews: 234,
    badge: "sale",
  },
  {
    id: "p12",
    name: "Amazon Echo Show 8",
    category: "smart-home",
    categoryLabel: "Smart Home",
    price: 149,
    image: "https://images.pexels.com/photos/318236/pexels-photo-318236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600",
    description: "Amazon Echo Show 8 with 8\" HD display, Alexa, and built-in camera.",
    features: ["8\" HD Display", "Alexa Voice Assistant", "13MP Camera", "Stereo Sound", "Smart Home Hub"],
    inStock: true,
    rating: 4.5,
    reviews: 178,
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};
