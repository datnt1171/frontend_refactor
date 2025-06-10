"use client"

import { createContext } from "react"

export interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  department?: {
    id: string
    name: string
  }
  role?: {
    id: string
    name: string
  }
  supervisor?: {
    id: string
    username: string
    first_name: string
    last_name: string
  }
}

export const UserContext = createContext<User | null>(null)