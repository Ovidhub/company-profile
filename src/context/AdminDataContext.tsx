import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ShoppingBag, type LucideIcon } from "lucide-react";
import { Product, Category, AVAILABLE_ICONS, DEFAULT_CATEGORIES, PRODUCTS as INITIAL_PRODUCTS } from "../data/products";
import { SERVICES as INITIAL_SERVICES, Service } from "../data/services";
import { IMAGES as INITIAL_IMAGES, ImageRegistry } from "../data/images";
import { PaymentMethod as PaymentMethodType } from "../data/paymentMethods";
import { api, ApiError } from "../lib/api";
import { useAuth } from "./AuthContext";

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

export interface PlaceOrderPayload {
  customer: Order["customer"];
  items: { product_id: number; quantity: number }[];
  shipping_method: "std" | "exp" | "pck";
  payment_method_id: number;
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
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  lastOrder: Order | null;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  removeOrder: (id: string) => void;

  // Messages
  addMessage: (data: Omit<ContactMessage, "id" | "date" | "read">) => Promise<void>;
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

// === icon name <-> component mapping (the API stores names; the UI renders components) ===
const ICON_BY_NAME: Record<string, LucideIcon> = Object.fromEntries(AVAILABLE_ICONS.map((i) => [i.name, i.icon]));

function iconToName(icon: unknown): string {
  if (typeof icon === "string") return ICON_BY_NAME[icon] ? icon : "ShoppingBag";
  const found = AVAILABLE_ICONS.find((i) => i.icon === icon);
  return found?.name ?? "ShoppingBag";
}

interface ApiCategory {
  id: string;
  label: string;
  icon: string;
  description?: string | null;
  order: number;
  active: boolean;
}

function toClientCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    label: c.label,
    icon: ICON_BY_NAME[c.icon] ?? ShoppingBag,
    description: c.description ?? undefined,
    order: c.order,
    active: c.active,
  };
}

interface ContentBundle {
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
  images: Record<string, string>;
  categories: ApiCategory[];
  products: Product[];
  paymentMethods: PaymentMethod[];
}

function reportError(err: unknown, fallback: string) {
  const message = err instanceof ApiError ? err.message : fallback;
  alert(message);
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Static defaults render instantly; the API response replaces them.
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [servicios] = useState<Service[]>(INITIAL_SERVICES);
  const [images, setImages] = useState<ImageRegistry>(INITIAL_IMAGES);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [publicPaymentMethods, setPublicPaymentMethods] = useState<PaymentMethod[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const loadContent = useCallback(async () => {
    try {
      const content = await api.get<ContentBundle>("/content");
      setHeroSlides(content.heroSlides);
      setTestimonials(content.testimonials);
      setImages((prev) => ({ ...prev, ...content.images }) as ImageRegistry);
      setCategories(content.categories.map(toClientCategory));
      setProducts(content.products);
      setPublicPaymentMethods(content.paymentMethods);
    } catch (err) {
      console.warn("Could not load content from the API; using built-in defaults.", err);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Admin-only data needs a valid token.
  useEffect(() => {
    if (!isAuthenticated) return;
    api.get<{ order: never; data: Order[] } | Order[]>("/admin/orders")
      .then((res) => setOrders(Array.isArray(res) ? res : (res as { data: Order[] }).data))
      .catch(() => {});
    api.get<{ data: ContactMessage[] }>("/admin/messages")
      .then((res) => setMessages(Array.isArray(res) ? (res as unknown as ContactMessage[]) : res.data))
      .catch(() => {});
    api.get<{ data: PaymentMethod[] }>("/admin/payment-methods")
      .then((res) => setPaymentMethods(Array.isArray(res) ? (res as unknown as PaymentMethod[]) : res.data))
      .catch(() => {
        /* editors are not allowed to see payment methods — leave empty */
      });
  }, [isAuthenticated]);

  // === CATEGORIES ===
  const addCategory = (data: Omit<Category, "id" | "order">) => {
    api.post<{ data: ApiCategory }>("/admin/categories", {
      label: data.label,
      icon: iconToName(data.icon),
      description: data.description,
      active: data.active,
    })
      .then((res) => setCategories((prev) => [...prev, toClientCategory(res.data)]))
      .catch((err) => reportError(err, "Could not create the category."));
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    const payload: Record<string, unknown> = {};
    if (data.label !== undefined) payload.label = data.label;
    if (data.icon !== undefined) payload.icon = iconToName(data.icon);
    if (data.description !== undefined) payload.description = data.description;
    if (data.active !== undefined) payload.active = data.active;

    api.put<{ data: ApiCategory }>(`/admin/categories/${id}`, payload)
      .then((res) => setCategories((prev) => prev.map((c) => (c.id === id ? toClientCategory(res.data) : c))))
      .catch((err) => reportError(err, "Could not update the category."));
  };

  const removeCategory = (id: string) => {
    if (id === "all") {
      alert("Cannot delete the 'All Products' category.");
      return;
    }
    const productCount = products.filter((p) => p.category === id).length;
    if (productCount > 0 && !confirm(`This category has ${productCount} product(s). Products will be moved to 'Other'. Continue?`)) {
      return;
    }
    api.delete(`/admin/categories/${id}`)
      .then(() => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setProducts((prev) => prev.map((p) => (p.category === id ? { ...p, category: "other", categoryLabel: "Other" } : p)));
      })
      .catch((err) => reportError(err, "Could not delete the category."));
  };

  const reorderCategories = (ids: string[]) => {
    api.post<{ data: ApiCategory[] }>("/admin/categories/reorder", { ids })
      .then((res) => setCategories(res.data.map(toClientCategory)))
      .catch((err) => reportError(err, "Could not reorder categories."));
  };

  // === PAYMENT METHODS ===
  const paymentMethodPayload = (data: Partial<PaymentMethod>) => {
    const payload: Record<string, unknown> = { ...data };
    delete payload.id;
    // Empty secret means "leave the stored secret untouched".
    if (!payload.secretKey) delete payload.secretKey;
    return payload;
  };

  const applyDefaultExclusivity = (updated: PaymentMethod) => (prev: PaymentMethod[]) =>
    prev.map((m) => (m.id === updated.id ? updated : updated.isDefault ? { ...m, isDefault: false } : m));

  const addPaymentMethod = (data: Omit<PaymentMethod, "id" | "order">) => {
    api.post<{ data: PaymentMethod }>("/admin/payment-methods", paymentMethodPayload(data))
      .then((res) => setPaymentMethods((prev) => [...applyDefaultExclusivity(res.data)(prev), res.data].filter((m, i, all) => all.findIndex((x) => x.id === m.id) === i)))
      .catch((err) => reportError(err, "Could not create the payment method."));
  };

  const updatePaymentMethod = (id: string, data: Partial<PaymentMethod>) => {
    api.put<{ data: PaymentMethod }>(`/admin/payment-methods/${id}`, paymentMethodPayload(data))
      .then((res) => setPaymentMethods(applyDefaultExclusivity(res.data)))
      .catch((err) => reportError(err, "Could not update the payment method."));
  };

  const removePaymentMethod = (id: string) => {
    api.delete(`/admin/payment-methods/${id}`)
      .then(() => setPaymentMethods((prev) => prev.filter((m) => m.id !== id)))
      .catch((err) => reportError(err, "Could not delete the payment method."));
  };

  const setDefaultPaymentMethod = (id: string) => {
    updatePaymentMethod(id, { isDefault: true });
  };

  // === HERO SLIDES ===
  const slidePayload = (data: Partial<HeroSlide>) => {
    const payload: Record<string, unknown> = { ...data };
    delete payload.id;
    return payload;
  };

  const addHeroSlide = (data: Omit<HeroSlide, "id">) => {
    api.post<{ data: HeroSlide }>("/admin/hero-slides", slidePayload(data))
      .then((res) => setHeroSlides((prev) => [...prev, res.data]))
      .catch((err) => reportError(err, "Could not create the slide."));
  };

  const updateHeroSlide = (id: string, data: Partial<HeroSlide>) => {
    api.put<{ data: HeroSlide }>(`/admin/hero-slides/${id}`, slidePayload(data))
      .then((res) => setHeroSlides((prev) => prev.map((s) => (s.id === id ? res.data : s))))
      .catch((err) => reportError(err, "Could not update the slide."));
  };

  const removeHeroSlide = (id: string) => {
    api.delete(`/admin/hero-slides/${id}`)
      .then(() => setHeroSlides((prev) => prev.filter((s) => s.id !== id)))
      .catch((err) => reportError(err, "Could not delete the slide."));
  };

  // === PRODUCTS ===
  const productPayload = (data: Partial<Product>) => {
    const payload: Record<string, unknown> = { ...data };
    delete payload.id;
    delete payload.categoryLabel; // derived server-side from the category
    delete payload.images;
    return payload;
  };

  const addProduct = (data: Omit<Product, "id">) => {
    api.post<{ data: Product }>("/admin/products", productPayload(data))
      .then((res) => setProducts((prev) => [...prev, res.data]))
      .catch((err) => reportError(err, "Could not create the product."));
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    api.put<{ data: Product }>(`/admin/products/${id}`, productPayload(data))
      .then((res) => setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p))))
      .catch((err) => reportError(err, "Could not update the product."));
  };

  const removeProduct = (id: string) => {
    api.delete(`/admin/products/${id}`)
      .then(() => setProducts((prev) => prev.filter((p) => p.id !== id)))
      .catch((err) => reportError(err, "Could not delete the product."));
  };

  // === SERVICES (static content in this version) ===
  const updateService = (_id: string, _data: Partial<Service>) => {
    console.warn("Service updates are limited to images in this demo");
  };
  const updateServiceImage = (id: string, image: string) => {
    const key = `service${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof ImageRegistry;
    updateImage(key, image);
  };

  // === IMAGES ===
  const updateImage = (key: keyof ImageRegistry, url: string) => {
    api.put(`/admin/site-images/${String(key)}`, { url })
      .then(() => setImages((prev) => ({ ...prev, [key]: url }) as ImageRegistry))
      .catch((err) => reportError(err, "Could not save the image."));
  };

  // === TESTIMONIALS ===
  const addTestimonial = (data: Omit<Testimonial, "id">) => {
    api.post<{ data: Testimonial }>("/admin/testimonials", data)
      .then((res) => setTestimonials((prev) => [...prev, res.data]))
      .catch((err) => reportError(err, "Could not create the testimonial."));
  };

  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    const payload: Record<string, unknown> = { ...data };
    delete payload.id;
    api.put<{ data: Testimonial }>(`/admin/testimonials/${id}`, payload)
      .then((res) => setTestimonials((prev) => prev.map((t) => (t.id === id ? res.data : t))))
      .catch((err) => reportError(err, "Could not update the testimonial."));
  };

  const removeTestimonial = (id: string) => {
    api.delete(`/admin/testimonials/${id}`)
      .then(() => setTestimonials((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => reportError(err, "Could not delete the testimonial."));
  };

  // === ORDERS ===
  const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
    const res = await api.post<{ order: Order }>("/orders", payload);
    setLastOrder(res.order);
    setOrders((prev) => [res.order, ...prev]);
    return res.order;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    api.patch<{ order: Order }>(`/admin/orders/${id}`, { status })
      .then((res) => setOrders((prev) => prev.map((o) => (o.id === id ? res.order : o))))
      .catch((err) => reportError(err, "Could not update the order status."));
  };

  const removeOrder = (id: string) => {
    api.delete(`/admin/orders/${id}`)
      .then(() => setOrders((prev) => prev.filter((o) => o.id !== id)))
      .catch((err) => reportError(err, "Could not delete the order."));
  };

  // === MESSAGES ===
  const addMessage = async (data: Omit<ContactMessage, "id" | "date" | "read">): Promise<void> => {
    await api.post("/messages", data);
  };

  const markMessageRead = (id: string) => {
    api.patch<{ data: ContactMessage }>(`/admin/messages/${id}`, { read: true })
      .then((res) => setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m))))
      .catch((err) => reportError(err, "Could not update the message."));
  };

  const removeMessage = (id: string) => {
    api.delete(`/admin/messages/${id}`)
      .then(() => setMessages((prev) => prev.filter((m) => m.id !== id)))
      .catch((err) => reportError(err, "Could not delete the message."));
  };

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
        placeOrder, lastOrder, updateOrderStatus, removeOrder,
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
