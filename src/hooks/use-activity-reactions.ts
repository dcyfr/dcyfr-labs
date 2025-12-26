/**
 * Activity Reactions Hook
 *
 * React hook for managing user reactions (likes) to activities.
 * Provides optimistic UI updates with localStorage persistence.
 *
 * Features:
 * - Check if activity is liked
 * - Toggle like state
 * - Get reaction counts (real user interactions only)
 * - Automatic localStorage sync
 *
 * @example
 * ```tsx
 * function ActivityCard({ activity }) {
 *   const { isLiked, toggleLike, getCount } = useActivityReactions();
 *
 *   return (
 *     <button onClick={() => toggleLike(activity.id)}>
 *       {isLiked(activity.id) ? '❤️' : '🤍'} {getCount(activity.id)}
 *     </button>
 *   );
 * }
 * ```
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { ReactionType, ReactionCollection } from "@/lib/activity/reactions";
import {
  loadReactions,
  saveReactions,
  toggleReaction as toggleReactionUtil,
  isActivityLiked as isLikedUtil,
  getSimulatedReactionCount,
  getReactionStats,
} from "@/lib/activity/reactions";

// ============================================================================
// TYPES
// ============================================================================

export interface UseActivityReactionsReturn {
  /** Check if an activity is liked by the user */
  isLiked: (activityId: string, type?: ReactionType) => boolean;

  /** Toggle like state for an activity (optimistic update) */
  toggleLike: (activityId: string, type?: ReactionType) => void;

  /** Get real reaction count (0 if not reacted, 1 if reacted by user) */
  getCount: (activityId: string, type?: ReactionType) => number;

  /** Get all reacted activity IDs */
  getLikedIds: (type?: ReactionType) => string[];

  /** Current reaction collection */
  reactions: ReactionCollection;

  /** Loading state (initial load from localStorage) */
  loading: boolean;

  /** Get statistics about reactions */
  stats: ReturnType<typeof getReactionStats>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for managing activity reactions
 */
export function useActivityReactions(): UseActivityReactionsReturn {
  // Initialize from loadReactions to avoid setState in effect
  const [reactions, setReactions] = useState<ReactionCollection>(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      console.debug("[useActivityReactions] SSR context, returning empty collection");
      return {
        reactions: [],
        lastUpdated: new Date().toISOString(),
        version: 1,
      };
    }
    console.debug("[useActivityReactions] Initializing hook, loading reactions from storage");
    const loaded = loadReactions();
    console.info("[useActivityReactions] Hook initialized with", `${loaded.reactions.length} reactions`);
    return loaded;
  });

  const [loading, setLoading] = useState(false);

  // Sync to localStorage whenever reactions change
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      console.debug("[useActivityReactions] useEffect: Syncing reactions to localStorage, count:", `${reactions.reactions.length}`);
      saveReactions(reactions);
    }
  }, [reactions, loading]);

  /**
   * Check if an activity is liked
   */
  const isLiked = useCallback(
    (activityId: string, type: ReactionType = "like"): boolean => {
      if (typeof window === 'undefined') return false; // Suppress client-only data during SSR
      const liked = isLikedUtil(activityId, reactions, type);
      console.debug("[useActivityReactions] isLiked() check:", { activityId, type, result: liked });
      return liked;
    },
    [reactions]
  );

  /**
   * Toggle like state with optimistic update and Redis sync
   */
  const toggleLike = useCallback(
    (activityId: string, type: ReactionType = "like"): void => {
      console.debug("[useActivityReactions] toggleLike() called:", {
        activityId,
        type,
        currentReactionsCount: reactions.reactions.length,
      });

      // Optimistic localStorage update
      const wasLiked = isLikedUtil(activityId, reactions, type);
      console.debug("[useActivityReactions] toggleLike() before state update:", `wasLiked=${wasLiked}`);

      setReactions((current) => {
        const updated = toggleReactionUtil(activityId, current, type);
        console.debug("[useActivityReactions] toggleLike() state updated:", {
          beforeCount: current.reactions.length,
          afterCount: updated.reactions.length,
          action: wasLiked ? "removed" : "added",
        });
        return updated;
      });

      // Sync with Redis analytics (fire and forget)
      // Determine contentType from activityId if possible
      // Default to "activity" for activity feed items
      const contentType = "activity";
      const action = wasLiked ? "unlike" : "like";

      console.debug("[useActivityReactions] Syncing with Redis:", {
        slug: activityId,
        contentType,
        action,
      });

      fetch("/api/engagement/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activityId,
          contentType,
          action,
        }),
      })
        .then(() => {
          console.debug("[useActivityReactions] Successfully synced like to Redis:", { slug: activityId, action });
        })
        .catch((error) => {
          console.error("[useActivityReactions] Failed to sync like to Redis:", { slug: activityId, action, error });
          if (process.env.NODE_ENV === "development") {
            console.warn("[useActivityReactions] Redis sync error details:", error);
          }
        });
    },
    [reactions]
  );

  /**
   * Get real reaction count (user's actual interaction)
   */
  const getCount = useCallback(
    (activityId: string, type: ReactionType = "like"): number => {
      if (typeof window === 'undefined') return 0; // Suppress client-only data during SSR
      const count = getSimulatedReactionCount(activityId, reactions, type);
      console.debug("[useActivityReactions] getCount():", { activityId, type, count });
      return count;
    },
    [reactions]
  );

  /**
   * Get all liked activity IDs
   */
  const getLikedIds = useCallback(
    (type?: ReactionType): string[] => {
      const ids = reactions.reactions
        .filter((r) => !type || r.type === type)
        .map((r) => r.activityId);

      return Array.from(new Set(ids));
    },
    [reactions]
  );

  /**
   * Get reaction statistics
   */
  const stats = useCallback(() => {
    return getReactionStats(reactions);
  }, [reactions])();

  return {
    isLiked,
    toggleLike,
    getCount,
    getLikedIds,
    reactions,
    loading,
    stats,
  };
}
