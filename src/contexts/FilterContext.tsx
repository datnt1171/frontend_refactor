"use client"

import * as React from "react"

type RightSidebarContextType = {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const RightSidebarContext = React.createContext<RightSidebarContextType | null>(null)

export function RightSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true)

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = React.useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = React.useMemo(
    () => ({
      isOpen,
      toggle,
      open,
      close,
    }),
    [isOpen, toggle, open, close],
  )

  return <RightSidebarContext.Provider value={value}>{children}</RightSidebarContext.Provider>
}

export function useRightSidebar() {
  const context = React.useContext(RightSidebarContext)
  if (!context) {
    throw new Error("useRightSidebar must be used within a RightSidebarProvider")
  }
  return context
}
