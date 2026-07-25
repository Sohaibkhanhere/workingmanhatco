"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

interface AdminUser {
  email: string;
  name: string;
}

interface AdminContextType {
  user: AdminUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  token: null,
  isLoggedIn: false,
  login: async () => ({ success: false }),
  logout: () => {},
  loading: true,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");
      if (stored && storedUser) {
        const parsed = JSON.parse(storedUser);
        setToken(stored);
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      const adminUser: AdminUser = { email: data.user?.email ?? email, name: data.user?.name ?? "Admin" };

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(adminUser));
      setToken(data.token);
      setUser(adminUser);

      return { success: true };
    } catch {
      return { success: false, error: "Network error — is the server running?" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AdminContext.Provider value={{ user, token, isLoggedIn: !!token, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
