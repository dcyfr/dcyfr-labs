/**
 * Social Media Links Configuration
 * 
 * Centralized management of all social media accounts and profiles.
 * Used across the site for consistent linking and display.
 */

export type SocialPlatform = 
  | "calendar"
  | "linkedin" 
  | "github" 
  | "github-sponsor" 
  | "peerlist" 
  | "goodreads"
  | "credly"
  | "orcid"
  | "twitter";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
  icon?: string; // Optional icon identifier for UI libraries
  description?: string; // Optional description for accessibility
};

/**
 * Primary social media accounts
 */
export const socialLinks: SocialLink[] = [
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/dcyfr",
      icon: "linkedin",
      description: "Connect with me on LinkedIn"
    },
    {
      platform: "peerlist",
      label: "Peerlist",
      url: "https://peerlist.io/dcyfr",
      icon: "users",
      description: "Build with me on Peerlist"
    },
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/dcyfr",
      icon: "github",
      description: "View my code"
    },
    {
      platform: "github-sponsor",
      label: "Become a Sponsor",
      url: "https://github.com/sponsors/dcyfr",
      icon: "heart",
      description: "Support open source contributions"
    },
    {
      platform: "calendar",
      label: "Book a Meeting",
      url: "https://cal.com/dcyfr",
      icon: "calendar",
      description: "Let's meet up"
    },
    {
      platform: "credly",
      label: "Credly",
      url: "https://www.credly.com/users/dcyfr",
      icon: "award",
      description: "View my professional certifications"
    },
    {
      platform: "orcid",
      label: "ORCID",
      url: "https://orcid.org/0009-0008-1312-2812",
      icon: "graduation-cap",
      description: "View my research contributions"
    },
    {
      platform: "goodreads",
      label: "Goodreads",
      url: "https://www.goodreads.com/dcyfr",
      icon: "book-open",
      description: "Look through my bookshelf"
    }
  ];

/**
 * Get social link by platform
 */
export function getSocialLink(platform: SocialPlatform): SocialLink | undefined {
  return socialLinks.find(link => link.platform === platform);
}

/**
 * Get all social URLs as an array (useful for JSON-LD schema)
 */
export function getSocialUrls(): string[] {
  return socialLinks.map(link => link.url);
}

/**
 * Username/handle constants for dynamic URL construction
 */
export const SOCIAL_HANDLES = {
  github: "dcyfr",
  linkedin: "dcyfr",
  peerlist: "dcyfr",
  goodreads: "dcyfr",
} as const;
