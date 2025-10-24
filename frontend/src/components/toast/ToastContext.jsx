import React, { createContext, useContext } from "react";

export const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

// Nota: No se exporta ToastProvider desde este archivo para cumplir la regla de Fast Refresh
