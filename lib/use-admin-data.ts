"use client";
import { useState, useEffect } from "react";
import { loadAdminData, defaultAdminData, ADMIN_KEY } from "./admin-store";
import type { AdminData } from "./admin-types";

export function useAdminData(): AdminData {
  const [data, setData] = useState<AdminData>(defaultAdminData);

  useEffect(() => {
    setData(loadAdminData());
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail as AdminData;
      if (d) setData(d);
    };
    window.addEventListener("admin-updated", handler);
    // Also listen for storage changes (cross-tab sync)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === ADMIN_KEY) setData(loadAdminData());
    };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("admin-updated", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return data;
}
