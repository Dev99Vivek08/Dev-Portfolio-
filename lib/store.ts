"use client";
import { defaultData, PortfolioData } from "./data";

const STORAGE_KEY = "devos_portfolio_data";

export function loadLocalData(): PortfolioData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
}

export function saveLocalData(data: Partial<PortfolioData>) {
  if (typeof window === "undefined") return;
  try {
    const existing = loadLocalData();
    const merged = deepMerge(existing, data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    // Dispatch event so all components re-render
    window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: merged }));
  } catch (e) {
    console.error("Failed to save portfolio data", e);
  }
}

export function resetLocalData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("portfolio-updated", { detail: defaultData }));
}

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key]) &&
      typeof base[key] === "object" &&
      base[key] !== null &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key] as Record<string, unknown>, override[key] as Record<string, unknown>);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}
