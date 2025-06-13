"use client";

import { createContext, useState, useEffect } from "react";
import type { UserDetail } from "@/types/api";
import { getCurrentUser } from "@/lib/api/users";

export const UserContext = createContext<UserDetail | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    getCurrentUser().then(res => setUser(res.data));
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}