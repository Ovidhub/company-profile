import {
  Wheat, // 🌾 Agriculture
  TrendingUp, // 📊 Financial Markets
  Film, // 🎬 Film Production
  Cpu, // 💻 Technology
  Globe, // 🌐 Web Design
  Megaphone, // 📈 Digital Marketing
  Video, // 🎥 Content Creation
  Sparkles, // ✨ Cleaning Services
  ShieldCheck, // 🛡️ Security
  Zap, // ⚡ Electrical
  Building2, // 🏢 Real Estate
  Users, // 👥 Professional Team
  Clock, // ⏱️ Reliable Delivery
  DollarSign, // 💰 Affordable Pricing
  Target, // 🎯 Customer-Focused
  Award, // ✅ Quality Assurance
  ShoppingBag, // 🛍️ All Products
  Smartphone, // 📱 Smartphones
  Laptop, // 💻 Laptops (alternative)
  Keyboard, // ⌨️ Accessories
  Headphones, // 🎧 Audio
  Watch, // ⌚ Wearables
  Home, // 🏠 Smart Home
  Truck, // 🚚 Shipping
  Shield, // 🛡️ Security
  RotateCcw, // 🔄 Returns
} from "lucide-react";

export const CATEGORY_ICONS = {
  all: ShoppingBag,
  smartphones: Smartphone,
  laptops: Laptop,
  accessories: Keyboard,
  audio: Headphones,
  wearables: Watch,
  "smart-home": Home,
} as const;

export const SERVICE_ICONS = {
  film: Film,
  agriculture: Wheat,
  finance: TrendingUp,
  tech: Cpu,
  webdesign: Globe,
  marketing: Megaphone,
  content: Video,
  cleaning: Sparkles,
  security: ShieldCheck,
  electrical: Zap,
  realestate: Building2,
} as const;

export const VALUE_ICONS = {
  team: Users,
  time: Clock,
  price: DollarSign,
  focus: Target,
  quality: Award,
} as const;

export const TRUST_ICONS = {
  shipping: Truck,
  shield: Shield,
  returns: RotateCcw,
  support: Headphones,
} as const;
