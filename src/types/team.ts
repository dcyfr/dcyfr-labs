/**
 * Team Member Types
 * 
 * Type definitions for team member data used across /team and /about pages.
 */

import type { LucideIcon } from "lucide-react";

export interface TeamMemberBadge {
  label: string;
  icon: LucideIcon;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  badges: TeamMemberBadge[];
  strengths?: string[];
  philosophy?: string;
  capabilities?: string[];
  integration?: string;
  highlights?: TeamHighlight[];
  avatarType: "image" | "icon";
  avatarIcon?: LucideIcon;
  avatarImagePath?: string;
  isPrimary?: boolean;
  slug: string; // URL slug for profile page (/about/[slug])
  profileUrl: string; // Full URL to profile page
}

export interface TeamCollaborationArea {
  title: string;
  icon: LucideIcon;
  description: string;
}

export interface TeamHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}
