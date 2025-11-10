"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Award, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TYPOGRAPHY, SPACING } from "@/lib/design-tokens";

/**
 * About Stats Component
 * 
 * Displays key career metrics and achievements in an animated card grid.
 * Features number counters that animate on mount for visual engagement.
 * 
 * @component
 * @example
 * ```tsx
 * <AboutStats />
 * ```
 */

type Stat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  animateNumber?: number; // Optional number to animate to
  suffix?: string; // Optional suffix for animated numbers
};

const stats: Stat[] = [
  {
    label: "Years in Cybersecurity",
    value: "5+",
    icon: TrendingUp,
    description: "Leading security programs",
    animateNumber: 5,
    suffix: "+",
  },
  {
    label: "Vulnerability Reduction",
    value: "23%",
    icon: Shield,
    description: "Global security improvements",
    animateNumber: 23,
    suffix: "%",
  },
  {
    label: "Faster Incident Response",
    value: "35%",
    icon: Zap,
    description: "Response time optimization",
    animateNumber: 35,
    suffix: "%",
  },
  {
    label: "Professional Certifications",
    value: "20+",
    icon: Award,
    description: "GIAC, CompTIA, Mile2, ISC2",
    animateNumber: 20,
    suffix: "+",
  },
  {
    label: "Compliance Frameworks",
    value: "4+",
    icon: CheckCircle2,
    description: "ISO 27001, SOC2, TISAX, TPN",
    animateNumber: 4,
    suffix: "+",
  },
];

/**
 * Animated counter hook
 * Animates a number from 0 to target value over specified duration
 */
function useCounter(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return count;
}

/**
 * Individual stat card with animation
 */
function StatCard({ stat }: { stat: Stat }) {
  const [mounted, setMounted] = useState(false);
  const animatedValue = useCounter(stat.animateNumber || 0, 1500);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayValue = mounted && stat.animateNumber 
    ? `${animatedValue}${stat.suffix || ""}`
    : stat.value;

  const Icon = stat.icon;

  return (
    <Card className="p-6 space-y-3 hover:border-primary transition-colors">
      <div className="flex items-start justify-between">
        <Icon className="h-5 w-5 text-primary flex-shrink-0" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        {/* Stats display uses custom sizing, not semantic heading typography */}
        {/* eslint-disable-next-line no-restricted-syntax */}
        <p className="text-3xl font-bold tracking-tight">
          {displayValue}
        </p>
        {/* eslint-disable-next-line no-restricted-syntax */}
        <p className="text-sm font-medium text-foreground">
          {stat.label}
        </p>
        <p className="text-xs text-muted-foreground">
          {stat.description}
        </p>
      </div>
    </Card>
  );
}

/**
 * Main stats grid component
 */
export function AboutStats() {
  return (
    <section className={SPACING.content}>
      <h2 className={TYPOGRAPHY.h2.standard}>By the Numbers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>
    </section>
  );
}
