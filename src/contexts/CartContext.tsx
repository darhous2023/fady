"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: string
  slug: string
  name_ar: string
  price: number
  image: string | null
  quality_tier: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  count: number
  total: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "shahy-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  const persist = (next: CartItem[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      const next = exists
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }]
      persist(next)
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      persist(next)
      return next
    })
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    setItems(prev => {
      const next = qty <= 0
        ? prev.filter(i => i.id !== id)
        : prev.map(i => i.id === id ? { ...i, quantity: qty } : i)
      persist(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, total, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be within CartProvider")
  return ctx
}
