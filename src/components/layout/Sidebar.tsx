"use client"

import { Navigation } from "./Navigation"

export function Sidebar() {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0" style={{ top: '64px' }}>
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="mt-5 flex-grow flex flex-col">
          <Navigation />
        </div>
      </div>
    </div>
  )
}