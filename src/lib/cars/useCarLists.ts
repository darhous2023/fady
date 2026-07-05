"use client"

import { useCallback, useEffect, useState } from "react"

const FAVORITES_KEY = "elfady_new_cars_favorites"
const COMPARE_KEY = "elfady_new_cars_compare"
export const MAX_COMPARE = 4

function readList(key: string): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function writeList(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent("cars-list-changed", { detail: { key } }))
  } catch {
    // localStorage unavailable (private mode, quota) — feature degrades to a no-op, never throws.
  }
}

/** Shared localStorage-backed list (favorites or compare selection), reactive across components on the same page via a custom event. */
function useCarKeyList(storageKey: string, max?: number) {
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    setKeys(readList(storageKey))
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string } | undefined
      if (!detail || detail.key === storageKey) setKeys(readList(storageKey))
    }
    window.addEventListener("cars-list-changed", onChange)
    return () => window.removeEventListener("cars-list-changed", onChange)
  }, [storageKey])

  const has = useCallback((normalizedKey: string) => keys.includes(normalizedKey), [keys])

  const toggle = useCallback((normalizedKey: string): boolean => {
    const current = readList(storageKey)
    const exists = current.includes(normalizedKey)
    let next: string[]
    if (exists) {
      next = current.filter((k) => k !== normalizedKey)
    } else {
      if (max && current.length >= max) return false
      next = [...current, normalizedKey]
    }
    writeList(storageKey, next)
    setKeys(next)
    return true
  }, [storageKey, max])

  const clear = useCallback(() => {
    writeList(storageKey, [])
    setKeys([])
  }, [storageKey])

  return { keys, has, toggle, clear }
}

export function useFavorites() {
  return useCarKeyList(FAVORITES_KEY)
}

export function useCompareSelection() {
  return useCarKeyList(COMPARE_KEY, MAX_COMPARE)
}
