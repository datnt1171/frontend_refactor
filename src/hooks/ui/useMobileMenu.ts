"use client"

import { useState } from "react"

export function useMobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu
  }
}