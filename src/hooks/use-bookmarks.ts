"use client";

import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "bookmarked-posts";

// Helper to check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Helper to load bookmarks from localStorage
function loadBookmarks(): string[] {
  if (!isBrowser) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("[useBookmarks] Failed to load bookmarks:", error);
  }
  return [];
}

/**
 * Custom hook for managing bookmarked posts with localStorage persistence
 * 
 * Features:
 * - LocalStorage persistence (survives page refreshes)
 * - SSR-safe (checks for browser environment)
 * - Real-time sync across components via storage event
 * - Type-safe operations (add, remove, check, clear)
 * - Graceful error handling
 * 
 * @returns Object with bookmarks array and manipulation functions
 * 
 * @example
 * ```tsx
 * const { bookmarks, isBookmarked, addBookmark, removeBookmark, clearBookmarks } = useBookmarks();
 * 
 * // Check if post is bookmarked
 * if (isBookmarked('my-post-slug')) { ... }
 * 
 * // Add bookmark
 * addBookmark('my-post-slug');
 * 
 * // Remove bookmark
 * removeBookmark('my-post-slug');
 * 
 * // Clear all bookmarks
 * clearBookmarks();
 * ```
 */
export function useBookmarks() {
  // Initialize with loaded bookmarks (runs once on mount, before first render)
  const [bookmarks, setBookmarks] = useState<string[]>(loadBookmarks);

  // Sync bookmarks across tabs/windows via storage event
  useEffect(() => {
    if (!isBrowser) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setBookmarks(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("[useBookmarks] Failed to sync bookmarks:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save bookmarks to localStorage
  const saveBookmarks = useCallback((newBookmarks: string[]) => {
    if (!isBrowser) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error("[useBookmarks] Failed to save bookmarks:", error);
    }
  }, []);

  // Check if a post is bookmarked
  const isBookmarked = useCallback((slug: string): boolean => {
    return bookmarks.includes(slug);
  }, [bookmarks]);

  // Add a bookmark
  const addBookmark = useCallback((slug: string) => {
    if (!slug || isBookmarked(slug)) return;
    
    const newBookmarks = [...bookmarks, slug];
    saveBookmarks(newBookmarks);
  }, [bookmarks, isBookmarked, saveBookmarks]);

  // Remove a bookmark
  const removeBookmark = useCallback((slug: string) => {
    if (!isBookmarked(slug)) return;
    
    const newBookmarks = bookmarks.filter(s => s !== slug);
    saveBookmarks(newBookmarks);
  }, [bookmarks, isBookmarked, saveBookmarks]);

  // Toggle bookmark (add if not present, remove if present)
  const toggleBookmark = useCallback((slug: string) => {
    if (isBookmarked(slug)) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  // Clear all bookmarks
  const clearBookmarks = useCallback(() => {
    saveBookmarks([]);
  }, [saveBookmarks]);

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearBookmarks,
    count: bookmarks.length,
  };
}
