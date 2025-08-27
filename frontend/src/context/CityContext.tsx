"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type CityContextType = {
  city: string | null;
  setCity: (city: string) => void;
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCityState] = useState<string | null>(null);

  // Load city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("city");
    if (savedCity) setCityState(savedCity);
  }, []);

  const setCity = (newCity: string) => {
    localStorage.setItem("city", newCity); // persist
    setCityState(newCity);
  };

  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error("useCity must be used within CityProvider");
  return context;
};
