import type { InviteCode } from "@/types/invites";

/**
 * Invite Codes Data
 *
 * Centralized list of invite/referral codes for platforms and services.
 * Featured codes appear on /sponsors page, all codes on /invites page.
 */

export const inviteCodes: InviteCode[] = [
  {
    id: "peerlist",
    platform: "Peerlist",
    url: "https://peerlist.io/dcyfr/signup",
    description: "Professional network for people in tech. Build your portfolio, connect with peers, and discover opportunities.",
    category: "professional-network",
    featured: true,
    addedAt: "2025-12-06",
    metrics: "Join 100K+ builders"
  },
  {
    id: "cal",
    platform: "Cal.com",
    url: "https://refer.cal.com/dcyfr",
    description: "Schedule a 1:1 meeting to discuss security, architecture, or career growth in tech.",
    category: "productivity-tools",
    featured: true,
    addedAt: "2025-12-06",
    metrics: "Book a free intro call"
  },
];

/**
 * Get featured invite codes (shown on /sponsors page)
 */
export const featuredInviteCodes = inviteCodes.filter(code => code.featured);

/**
 * Get invite codes by category
 */
export function getInviteCodesByCategory(category: InviteCode["category"]): InviteCode[] {
  return inviteCodes.filter(code => code.category === category);
}

/**
 * Get invite code by ID
 */
export function getInviteCodeById(id: string): InviteCode | undefined {
  return inviteCodes.find(code => code.id === id);
}

/**
 * Category labels for display
 */
export const INVITE_CODE_CATEGORY_LABELS: Record<InviteCode["category"], string> = {
  "professional-network": "Professional Networks",
  "developer-community": "Developer Communities",
  "design-tools": "Design Tools",
  "learning-platform": "Learning Platforms",
  "productivity-tools": "Productivity Tools",
  "other": "Other"
};
