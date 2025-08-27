"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/axios";

type User = {
  name: string;
  email: string;
  role: "user" | "admin";
  bookings: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          try {
            await api.post("/auth/refresh"); // refresh accessToken
            const res2 = await api.get("/auth/me");
            setUser(res2.data.user);
          } catch {
            setUser(null);
          }
        } else {
          setError("Failed to fetch user");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/login", { email, password });
      const res = await api.get("/auth/me");
      console.log(res)
      setUser(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", { name, email, password });
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout"); // clears cookies
      setUser(null);
    } catch {
      setError("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
