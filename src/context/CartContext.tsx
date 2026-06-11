import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_QUANTITY = 99;

const clampQuantity = (q: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(q)));

// localStorage is user-editable — drop anything that isn't a well-formed cart
// item so tampered data can't crash the app or inject bogus prices/quantities.
function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i): i is CartItem =>
      !!i && typeof i === "object" &&
      typeof i.id === "string" && typeof i.name === "string" &&
      typeof i.price === "number" && Number.isFinite(i.price) && i.price >= 0 &&
      typeof i.quantity === "number" && Number.isFinite(i.quantity)
    )
    .map((i) => ({ ...i, quantity: clampQuantity(i.quantity) }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? sanitizeCart(JSON.parse(saved)) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      /* storage full or unavailable — cart lives in memory only */
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: clampQuantity(i.quantity + quantity) } : i));
      }
      return [...prev, { ...product, quantity: clampQuantity(quantity) }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: clampQuantity(quantity) } : i)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, shipping, tax, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
