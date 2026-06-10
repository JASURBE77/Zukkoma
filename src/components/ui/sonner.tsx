"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Global toast konteyneri. Umumiy toast'lar `@/lib/notify` orqali to'liq custom
 * kartalar bilan ko'rsatiladi; bu yerda faqat joylashuv va default'lar.
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      gap={10}
      offset={16}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
