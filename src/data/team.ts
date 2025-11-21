/**
 * Team Data
 * 
 * Centralized team member information for /team and /about pages.
 */

import { Bot, Code, Shield, Sparkles, Zap } from "lucide-react";
import type { TeamMember, TeamCollaborationArea, TeamHighlight } from "@/types/team";

export const teamDescription = "A human-AI partnership building secure, innovative solutions for the modern web.";

export const teamMembers: TeamMember[] = [
  {
    id: "drew",
    name: "Drew",
    title: "Cybersecurity Architect",
    subtitle: "Security-Focused Developer",
    description: "Experienced cybersecurity architect driving secure, compliant, and innovative web solutions.",
    badges: [
      { label: "Security", icon: Shield },
      { label: "Development", icon: Code },
    ],
    strengths: [
      "Threat modeling & risk assessment",
      "Secure architecture design",
      "Compliance & regulatory expertise",
      "Incident response & forensics",
      "DevSecOps & secure CI/CD",
    ],
    philosophy: "Security is not a barrier—it's the foundation for innovation and trust in the digital age.",
    avatarType: "image",
    isPrimary: false,
  },
  {
    id: "cyberdrew",
    name: "CyberDrew",
    title: "AI Security Engineer",
    subtitle: "Automated Security & Development Assistant",
    description: "AI-powered assistant specializing in automated security analysis, code generation, and development acceleration.",
    badges: [
      { label: "AI-Powered", icon: Zap },
      { label: "Security", icon: Shield },
    ],
    capabilities: [
      "Automated threat detection",
      "Security best practice enforcement",
      "Code generation & optimization",
      "Vulnerability scanning & reporting",
      "Continuous learning from security data",
    ],
    philosophy: "Security isn't about saying no—it's about enabling innovation with confidence.",
    avatarType: "image",
    isPrimary: true,
  },
  {
    id: "dcyfr",
    name: "DCYFR",
    title: "AI Development Assistant",
    subtitle: "Context-Aware Coding Assistant",
    description: "Context-aware coding and security assistant accelerating implementation, analysis, and docs.",
    badges: [
      { label: "AI-Powered", icon: Zap },
      { label: "Automation", icon: Code },
    ],
    capabilities: [
      "Code generation & refactoring",
      "Security vulnerability analysis",
      "Architecture & design patterns",
      "Documentation & testing assistance",
      "Real-time development context via MCP",
    ],
    integration: "Connected to GitHub, Sentry, Vercel, and other development tools via Model Context Protocol (MCP), providing comprehensive project awareness and intelligent assistance across the entire development lifecycle.",
    avatarType: "icon",
    avatarIcon: Bot,
    isPrimary: false,
  },
];