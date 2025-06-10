"use client"

import { Navigation } from "./Navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden" style={{ top: '64px' }}>
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75" 
        onClick={onClose}
      />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <Navigation isMobile onItemClick={onClose} />
        </div>
      </div>
    </div>
  )
}