import type { InviteCode } from "@/types/invites";

/**
 * Group invite codes by category
 * @param codes - Array of invite codes
 * @returns Map of category to array of codes
 */
export function groupInviteCodesByCategory(
  codes: InviteCode[]
): Map<InviteCode["category"], InviteCode[]> {
  const grouped = new Map<InviteCode["category"], InviteCode[]>();

  codes.forEach((code) => {
    if (!grouped.has(code.category)) {
      grouped.set(code.category, []);
    }
    grouped.get(code.category)!.push(code);
  });

  return grouped;
}

/**
 * Sort categories by number of codes (descending)
 * @param groupedCodes - Map of category to array of codes
 * @returns Array of [category, codes] tuples sorted by code count
 */
export function sortCategoriesByCount(
  groupedCodes: Map<InviteCode["category"], InviteCode[]>
): [InviteCode["category"], InviteCode[]][] {
  return Array.from(groupedCodes.entries()).sort(
    ([, a], [, b]) => b.length - a.length
  );
}
