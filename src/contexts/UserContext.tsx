"use client"

import { createContext } from "react"

import type { UserDetail } from "@/types/api"

export const UserContext = createContext<UserDetail | null>(null)