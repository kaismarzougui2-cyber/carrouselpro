// src/lib/paywall.jsx
// Paywall disabled — no authentication, everyone gets full access.

export const FREE_CAROUSEL_LIMIT = Infinity

export function applyWatermark() {}

export function usePaywall() {
  return {
    isPremium: true,
    canExportClean: true,
    canSave: true,
    gateExport: (canvas) => canvas,
    gateSave: (onSave) => { onSave(); return true },
    showPaywall: false,
    openPaywall: () => {},
    closePaywall: () => {},
  }
}

export function PaywallModal() { return null }
