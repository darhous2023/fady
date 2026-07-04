"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const VISITOR_COOKIE = "elfady_vid"

function getOrCreateVisitorId(): string {
  const match = document.cookie.match(new RegExp(`(?:^|; )${VISITOR_COOKIE}=([^;]*)`))
  if (match) return decodeURIComponent(match[1])

  const id = crypto.randomUUID()
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${VISITOR_COOKIE}=${id}; path=/; max-age=${oneYear}; SameSite=Lax`
  return id
}

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return
    const visitor_id = getOrCreateVisitorId()
    const payload = JSON.stringify({ path: pathname, visitor_id })

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track-view", new Blob([payload], { type: "application/json" }))
    } else {
      fetch("/api/track-view", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {})
    }
  }, [pathname])

  return null
}
