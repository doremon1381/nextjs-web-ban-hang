'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

interface AddItemProduct {
  id: string;
  name: string;
  image: string;
  unit: string;
  price: number;
}

interface AddItemVariant {
  id: string;
  name: string;
  price: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: AddItemProduct, variant?: AddItemVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nhanviet-cart');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('nhanviet-cart', JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (product: AddItemProduct, variant?: AddItemVariant, quantity = 1) => {
    const cartItemId = variant ? `${product.id}-${variant.id}` : product.id;
    setItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: cartItemId,
        productId: product.id,
        variantId: variant?.id ?? '',
        name: product.name,
        variantName: variant?.name ?? '',
        price: variant?.price ?? product.price,
        quantity,
        image: product.image,
        unit: product.unit,
      }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)
    );
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, count, total, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
