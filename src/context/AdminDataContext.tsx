import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRODUCTS as INITIAL_PRODUCTS, Product, Category, DEFAULT_CATEGORIES } from "../data/products";
import { SERVICES as INITIAL_SERVICES, Service } from "../data/services";
import { IMAGES as INITIAL_IMAGES, ImageRegistry } from "../data/images";
import { PaymentMethod as PaymentMethodType, DEFAULT_PAYMENT_METHODS } from "../data/paymentMethods";

export type PaymentMethod = PaymentMethodType;

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface Order {
  id: string;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; zip: string; country: string };
  items: { productId: string; name: string; price: number; quantity: number; image: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

interface AdminDataContextType {
  // Data
  products: Product[];
  categories: Category[];
  servicios: Service[];
  images: ImageRegistry;
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  orders: Order[];
  messages: ContactMessage[];
  paymentMethods: PaymentMethod[];
  /** Payment methods with gateway secrets stripped — safe for public-facing pages. */
  publicPaymentMethods: PaymentMethod[];

  // Payment Methods
  addPaymentMethod: (data: Omit<PaymentMethod, "id" | "order">) => void;
  updatePaymentMethod: (id: string, data: Partial<PaymentMethod>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;

  // Categories
  addCategory: (data: Omit<Category, "id" | "order">) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  reorderCategories: (ids: string[]) => void;

  // Hero Slides
  updateHeroSlide: (id: string, data: Partial<HeroSlide>) => void;
  addHeroSlide: (data: Omit<HeroSlide, "id">) => void;
  removeHeroSlide: (id: string) => void;

  // Products
  updateProduct: (id: string, data: Partial<Product>) => void;
  addProduct: (data: Omit<Product, "id">) => void;
  removeProduct: (id: string) => void;

  // Services
  updateService: (id: string, data: Partial<Service>) => void;
  updateServiceImage: (id: string, image: string) => void;

  // Images
  updateImage: (key: keyof ImageRegistry, url: string) => void;

  // Testimonials
  addTestimonial: (data: Omit<Testimonial, "id">) => void;
  removeTestimonial: (id: string) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  removeOrder: (id: string) => void;

  // Messages
  addMessage: (data: Omit<ContactMessage, "id" | "date" | "read">) => void;
  markMessageRead: (id: string) => void;
  removeMessage: (id: string) => void;

  // Stats
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  unreadMessages: number;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { id: "h1", title: "Revolutionizing Agriculture for a Sustainable Tomorrow", subtitle: "Empowering food security through smart animal farming, agri-tech innovation, and expert farm management solutions.", image: INITIAL_IMAGES.heroAgriculture, tag: "Agriculture", iconName: "Wheat" },
  { id: "h2", title: "Master the Markets. Build Wealth.", subtitle: "We offer expert-led forex education, strategic trading support, and financial risk management for long-term success.", image: INITIAL_IMAGES.heroFinance, tag: "Financial Markets", iconName: "TrendingUp" },
  { id: "h3", title: "Telling Stories That Inspire", subtitle: "From script to screen, we craft powerful visual narratives through expert cinematography, editing, and global media distribution.", image: INITIAL_IMAGES.heroFilm, tag: "Film Production", iconName: "Film" },
  { id: "h4", title: "Innovative Tech. Smarter Solutions.", subtitle: "Delivering cutting-edge ICT services, device sales, app development, and digital transformation strategies for the modern world.", image: INITIAL_IMAGES.heroTech, tag: "Technology", iconName: "Cpu" },
  { id: "h5", title: "Websites That Convert. Brands That Shine.", subtitle: "From business websites to e-commerce platforms — we design, develop, and optimize digital experiences that grow your business.", image: INITIAL_IMAGES.heroWebDesign, tag: "Web Design & Development", iconName: "Globe" },
  { id: "h6", title: "Secure Properties. Smart Buildings.", subtitle: "CCTV, access control, smart security, and property technology solutions for modern homes and businesses.", image: INITIAL_IMAGES.heroSecurity, tag: "Security Solutions", iconName: "ShieldCheck" },
  { id: "h7", title: "Clean Spaces. Professional Results.", subtitle: "We provide reliable, high-standard cleaning and disinfection services for homes, offices, and post-construction environments.", image: INITIAL_IMAGES.heroCleaning, tag: "Cleaning Services", iconName: "Sparkles" },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "David Mensah", role: "CEO, GreenBridge Group", text: "Partnering with De-ebrightmarn Limited has been one of the smartest business decisions we've made. Their innovative solutions and unwavering professionalism across multiple industries have made a tangible impact on our operations and community development goals.", rating: 5 },
  { id: "t2", name: "Sarah Oduwale", role: "Creative Director, Global Voices Media", text: "Working with De-ebrightmarn on our documentary was nothing short of exceptional. From scripting to post-production, their creative team delivered a powerful story that captured hearts globally.", rating: 5 },
  { id: "t3", name: "Ayodele Akinbiyi", role: "Commercial Farmer, Ogun State", text: "De-eFarm helped us transform our outdated farming processes into a sustainable, tech-driven operation. Their agri-tech solutions and expert consulting gave our farm a 40% boost in productivity within one season.", rating: 5 },
  { id: "t4", name: "Chinwe Okeke", role: "Forex Trader & Alumni", text: "As a young trader, I had limited knowledge of the financial markets. De-eFxacademy's training was a game-changer—clear, hands-on, and empowering. I now trade confidently with consistent results.", rating: 5 },
  { id: "t5", name: "Ibrahim Lawal", role: "COO, SwiftAccess Logistics", text: "The De-eTech team developed and deployed a custom ICT solution that automated 70% of our business processes. Their support and attention to detail have made them our go-to tech partner.", rating: 5 },
];

const DEFAULT_ORDERS: Order[] = [
  { id: "DEE-84736291", customer: { name: "David Mensah", email: "david@greenbridge.com", phone: "+234 803 456 7890", address: "24 Adetokunbo Ademola", city: "Abuja", state: "FCT", zip: "900001", country: "Nigeria" }, items: [{ productId: "p1", name: "iPhone 15 Pro Max", price: 1199, quantity: 1, image: INITIAL_IMAGES.serviceTech }, { productId: "p5", name: "AirPods Pro (2nd Gen)", price: 249, quantity: 2, image: INITIAL_IMAGES.serviceTech }], subtotal: 1697, shipping: 0, tax: 135.76, total: 1832.76, status: "delivered", paymentMethod: "Card ending 3456", date: "2025-01-15" },
  { id: "DEE-29401736", customer: { name: "Sarah Oduwale", email: "sarah@gvm.com", phone: "+234 802 123 4567", address: "10 Bishop Aboyade Cole", city: "Lagos", state: "Lagos", zip: "101233", country: "Nigeria" }, items: [{ productId: "p3", name: "MacBook Pro 16\" M3 Max", price: 3499, quantity: 1, image: INITIAL_IMAGES.serviceTech }], subtotal: 3499, shipping: 0, tax: 279.92, total: 3778.92, status: "shipped", paymentMethod: "Card ending 7821", date: "2025-01-20" },
  { id: "DEE-91827364", customer: { name: "Ibrahim Lawal", email: "ibrahim@swiftaccess.com", phone: "+234 805 999 1234", address: "5 Independence Ave", city: "Port Harcourt", state: "Rivers", zip: "500272", country: "Nigeria" }, items: [{ productId: "p11", name: "Google Nest Hub Max", price: 229, quantity: 1, image: INITIAL_IMAGES.serviceTech }, { productId: "p9", name: "Logitech MX Master 3S", price: 99, quantity: 1, image: INITIAL_IMAGES.serviceTech }], subtotal: 328, shipping: 25, tax: 26.24, total: 379.24, status: "processing", paymentMethod: "Bank Transfer", date: "2025-01-22" },
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  { id: "m1", name: "John Akinwale", email: "john@company.com", phone: "+234 803 111 2222", subject: "Partnership Opportunity", message: "Hi, I would like to discuss a potential partnership for our fintech startup. Could we schedule a call this week?", date: "2025-01-23T10:30:00", read: false },
  { id: "m2", name: "Mary Ogun", email: "mary.o@gmail.com", subject: "Service Inquiry", message: "Hello, I'm interested in your film production services for a corporate documentary. Please share your rates and availability.", date: "2025-01-22T14:15:00", read: true },
  { id: "m3", name: "Ahmed Bello", email: "ahmed@realestate.ng", phone: "+234 802 333 4444", subject: "Security Installation", message: "We need CCTV and access control installation for our new estate in Lekki. Can you send a quote?", date: "2025-01-21T09:00:00", read: false },
];

function loadState<T>(key: string, fallback: T, isValid?: (v: unknown) => boolean): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    // Tampered/corrupted storage must not crash the app — fall back to defaults.
    const check = isValid ?? (Array.isArray(fallback) ? Array.isArray : () => true);
    return check(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Quota can be exceeded when large base64 images are saved — keep the app running.
    console.warn(`Failed to persist "${key}" to localStorage`, err);
  }
}

const isPlainObject = (v: unknown) => typeof v === "object" && v !== null && !Array.isArray(v);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadState("admin_products", INITIAL_PRODUCTS));
  const [categories, setCategories] = useState<Category[]>(() => loadState("admin_categories", DEFAULT_CATEGORIES));
  const [servicios] = useState<Service[]>(INITIAL_SERVICES);
  const [images, setImages] = useState<ImageRegistry>(() => loadState("admin_images", INITIAL_IMAGES, isPlainObject));
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => loadState("admin_hero_slides", DEFAULT_HERO_SLIDES));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadState("admin_testimonials", DEFAULT_TESTIMONIALS));
  const [orders, setOrders] = useState<Order[]>(() => loadState("admin_orders", DEFAULT_ORDERS));
  const [messages, setMessages] = useState<ContactMessage[]>(() => loadState("admin_messages", DEFAULT_MESSAGES));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => loadState("admin_payment_methods", DEFAULT_PAYMENT_METHODS));

  useEffect(() => saveState("admin_products", products), [products]);
  useEffect(() => saveState("admin_categories", categories), [categories]);
  useEffect(() => saveState("admin_images", images), [images]);
  useEffect(() => saveState("admin_hero_slides", heroSlides), [heroSlides]);
  useEffect(() => saveState("admin_testimonials", testimonials), [testimonials]);
  useEffect(() => saveState("admin_orders", orders), [orders]);
  useEffect(() => saveState("admin_messages", messages), [messages]);
  useEffect(() => saveState("admin_payment_methods", paymentMethods), [paymentMethods]);

  // === CATEGORIES ===
  const addCategory = (data: Omit<Category, "id" | "order">) => {
    setCategories((prev) => {
      const maxOrder = prev.reduce((max, c) => Math.max(max, c.order), 0);
      const dataAny = data as Partial<Category>;
      const id = dataAny.id || (data.label || "category").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const uniqueId = prev.find((c) => c.id === id) ? `${id}-${Date.now()}` : id;
      return [...prev, { ...data, id: uniqueId, order: maxOrder + 1 } as Category];
    });
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const removeCategory = (id: string) => {
    if (id === "all") {
      alert("Cannot delete the 'All Products' category.");
      return;
    }
    const productCount = products.filter((p) => p.category === id).length;
    if (productCount > 0) {
      if (!confirm(`This category has ${productCount} product(s). Products will be moved to 'Other'. Continue?`)) return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Move products in this category to "other" or first available
    setProducts((prev) => prev.map((p) => (p.category === id ? { ...p, category: "other", categoryLabel: "Other" } : p)));
  };

  const reorderCategories = (ids: string[]) => {
    setCategories((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return ids.map((id, idx) => {
        const cat = map.get(id);
        return cat ? { ...cat, order: idx } : null;
      }).filter(Boolean) as Category[];
    });
  };

  // === PAYMENT METHODS ===
  const addPaymentMethod = (data: Omit<PaymentMethod, "id" | "order">) => {
    setPaymentMethods((prev) => {
      const maxOrder = prev.reduce((max, m) => Math.max(max, m.order), 0);
      const id = `pm_${data.type}_${Date.now()}`;
      let next = [...prev, { ...data, id, order: maxOrder + 1 } as PaymentMethod];
      // If this is set as default, un-default others
      if (data.isDefault) {
        next = next.map((m) => (m.id === id ? m : { ...m, isDefault: false }));
      }
      return next;
    });
  };

  const updatePaymentMethod = (id: string, data: Partial<PaymentMethod>) => {
    setPaymentMethods((prev) => {
      let next = prev.map((m) => (m.id === id ? { ...m, ...data } : m));
      // If this is being set as default, un-default others
      if (data.isDefault) {
        next = next.map((m) => (m.id === id ? m : { ...m, isDefault: false }));
      }
      return next;
    });
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  // === HERO SLIDES ===
  const updateHeroSlide = (id: string, data: Partial<HeroSlide>) => {
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };
  const addHeroSlide = (data: Omit<HeroSlide, "id">) => {
    setHeroSlides((prev) => [...prev, { ...data, id: `h${Date.now()}` }]);
  };
  const removeHeroSlide = (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  // === PRODUCTS ===
  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };
  const addProduct = (data: Omit<Product, "id">) => {
    setProducts((prev) => [...prev, { ...data, id: `p${Date.now()}` }]);
  };
  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // === SERVICES ===
  const updateService = (_id: string, _data: Partial<Service>) => {
    console.warn("Service updates are limited to images in this demo");
  };
  const updateServiceImage = (id: string, image: string) => {
    setImages((prev: ImageRegistry) => ({ ...prev, [`service${id.charAt(0).toUpperCase() + id.slice(1)}`]: image } as ImageRegistry));
  };

  // === IMAGES ===
  const updateImage = (key: keyof ImageRegistry, url: string) => {
    setImages((prev) => ({ ...prev, [key]: url }));
  };

  // === TESTIMONIALS ===
  const addTestimonial = (data: Omit<Testimonial, "id">) => {
    setTestimonials((prev) => [...prev, { ...data, id: `t${Date.now()}` }]);
  };
  const removeTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };
  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  // === ORDERS ===
  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };
  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };
  const removeOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // === MESSAGES ===
  const addMessage = (data: Omit<ContactMessage, "id" | "date" | "read">) => {
    setMessages((prev) => [{ ...data, id: `m${Date.now()}`, date: new Date().toISOString(), read: false }, ...prev]);
  };
  const markMessageRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };
  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Gateway secret keys must never reach customer-facing pages.
  const publicPaymentMethods = paymentMethods.map((m) => {
    const { secretKey: _secretKey, metadata: _metadata, ...safe } = m;
    return safe as PaymentMethod;
  });

  // === STATS ===
  const totalRevenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const totalProducts = products.length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  return (
    <AdminDataContext.Provider
      value={{
        products, categories, servicios, images, heroSlides, testimonials, orders, messages,
        addCategory, updateCategory, removeCategory, reorderCategories,
        updateHeroSlide, addHeroSlide, removeHeroSlide,
        updateProduct, addProduct, removeProduct,
        updateService, updateServiceImage, updateImage,
        addTestimonial, removeTestimonial, updateTestimonial,
        addOrder, updateOrderStatus, removeOrder,
        addMessage, markMessageRead, removeMessage,
        paymentMethods, publicPaymentMethods, addPaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod,
        totalRevenue, totalOrders, pendingOrders, totalProducts, unreadMessages,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
