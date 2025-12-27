"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/**
 * SearchProvider Context
 *
 * Global state for search modal (open/close).
 * Handles keyboard shortcuts (Cmd+K, Ctrl+K, /)
 */

interface SearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        // Don't trigger if typing in input/textarea
        if (
          e.target instanceof HTMLElement &&
          (e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.contentEditable === "true")
        ) {
          return;
        }

        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <SearchContext.Provider value={{ open, setOpen, toggle }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
