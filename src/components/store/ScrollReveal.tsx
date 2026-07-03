"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"

export function ScrollReveal({
  children, delay = 0, y = 28, className, style,
}: { children: ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduceMotion ? 0.01 : 0.7, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0.01 : 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
