"use client";

import { create } from "zustand";

interface MobileFilterSheetState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const mobileFilterSheetStore = create<MobileFilterSheetState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const useMobileFilterSheet = () => mobileFilterSheetStore();
