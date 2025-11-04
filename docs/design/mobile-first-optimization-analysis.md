# Mobile-First Design Optimization Analysis

**Analysis Date**: November 4, 2025  
**Focus**: Mobile UX, touch interactions, responsive patterns, performance  
**Current State**: Desktop-first with responsive breakpoints  
**Goal**: True mobile-first experience with native-app-like UX

---

## Executive Summary

The site currently uses responsive design with Tailwind breakpoints (sm, md, lg) but is fundamentally desktop-first. While the site works on mobile, it lacks mobile-specific optimizations and patterns. This analysis identifies opportunities to transform the experience into a true mobile-first design.

**Key Findings**:
- ✅ **Strengths**: Responsive typography, Next/Image optimization, server-first rendering
- ⚠️ **Needs Work**: Touch targets, mobile navigation, content density, gestures
- 🔴 **Missing**: Mobile-specific patterns, PWA features, native-like interactions

**Impact Priority**:
1. **Critical** (P0): Touch targets, mobile navigation, form optimization
2. **High** (P1): Content hierarchy, gestures, bottom navigation
3. **Medium** (P2): PWA features, advanced interactions, polish

---

## Current State Analysis

### Component-by-Component Audit

#### 1. Site Header (`site-header.tsx`)

**Current Implementation**:
```tsx
<header className="sticky top-0 z-40 backdrop-blur ... h-16">
  <div className="max-w-5xl px-6 md:px-8 h-16 flex items-center justify-between">
    <Link href="/" className="flex items-center gap-4 font-serif text-xl md:text-2xl">
      <Logo width={24} height={24} />
      <span className="hidden md:block">Drew's Lab</span>
    </Link>
    <nav className="flex items-center gap-4 text-sm">
      <Link href="/about">About</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/projects">Projects</Link>
      <ThemeToggle />
    </nav>
  </div>
</header>
```

**Issues**:
- Logo text hidden on mobile (wasted space)
- Small touch targets (text-sm, gap-4 = ~16px)
- No hamburger menu for content-heavy sites
- Navigation takes valuable horizontal space
- No mobile-specific interactions

**Mobile-First Recommendations**:

##### Option A: Hamburger Menu (Standard)
```tsx
<header className="sticky top-0 z-40 backdrop-blur h-14 md:h-16">
  <div className="max-w-5xl px-4 h-14 md:h-16 flex items-center justify-between">
    {/* Mobile: Hamburger + Logo + Theme */}
    <div className="flex items-center gap-3 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <nav className="flex flex-col gap-4 mt-8">
            <Link href="/about" className="text-lg font-medium py-3">
              About
            </Link>
            <Link href="/blog" className="text-lg font-medium py-3">
              Blog
            </Link>
            <Link href="/projects" className="text-lg font-medium py-3">
              Projects
            </Link>
            <Link href="/contact" className="text-lg font-medium py-3">
              Contact
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>

    {/* Logo - always visible */}
    <Link href="/" className="flex items-center gap-3">
      <Logo width={24} height={24} />
      <span className="font-serif text-lg md:text-xl">Drew's Lab</span>
    </Link>

    {/* Desktop navigation */}
    <nav className="hidden md:flex items-center gap-6">
      <Link href="/about" className="hover:text-primary transition-colors py-2">
        About
      </Link>
      {/* ... more links ... */}
    </nav>

    {/* Theme toggle - always visible */}
    <ThemeToggle />
  </div>
</header>
```

**Benefits**:
- More space for logo/branding on mobile
- Larger touch targets in drawer (text-lg, py-3)
- Industry-standard pattern (familiar)
- Cleaner header on mobile

##### Option B: Bottom Navigation (App-Like)
```tsx
// New component: mobile-nav.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, FolderKanban, Mail } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

**Benefits**:
- Native app-like feel
- Always accessible (no drawer open needed)
- Large touch targets (entire grid cell)
- Visual feedback for active route
- Thumb-friendly bottom placement

**Recommendation**: Implement **Option A** (hamburger) with bottom navigation as enhancement for mobile-heavy usage.

---

#### 2. Blog Post List (`post-list.tsx`)

**Current Implementation**:
```tsx
<article className="rounded-lg border p-4 transition-all hover:bg-muted/50">
  <div className="flex gap-4">
    {/* Thumbnail - always visible */}
    <PostThumbnail post={p} className="w-24 h-24 md:w-32 md:h-32" />
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={p.publishedAt}>...</time>
        <span>•</span>
        <span>{p.readingTime.text}</span>
      </div>
      <TitleTag className="text-lg md:text-xl">{p.title}</TitleTag>
      <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
    </div>
  </div>
</article>
```

**Issues**:
- Horizontal layout wastes space on mobile
- Small thumbnails (w-24 = 96px) don't showcase images
- Metadata clutters limited space
- No swipe actions or mobile-specific interactions
- Gap between articles too small for thumb navigation

**Mobile-First Redesign**:

##### Vertical Card Layout (Mobile)
```tsx
<article className="group rounded-lg border overflow-hidden transition-all hover:shadow-md active:scale-[0.98]">
  {/* Full-width thumbnail on mobile */}
  <div className="relative aspect-[16/9] md:hidden">
    <PostThumbnail 
      post={p} 
      fill 
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
    />
    {/* Badges overlay */}
    <div className="absolute top-2 right-2 flex gap-1.5">
      <PostBadges post={p} size="sm" />
    </div>
  </div>

  {/* Content */}
  <div className="p-4 md:p-5">
    {/* Desktop: horizontal layout with thumbnail */}
    <div className="hidden md:flex gap-4">
      <PostThumbnail post={p} className="w-32 h-32 flex-shrink-0" />
      <div className="flex-1">
        {/* Desktop content */}
      </div>
    </div>

    {/* Mobile: stacked content */}
    <div className="md:hidden space-y-2">
      {/* Title first (most important) */}
      <h2 className="text-lg font-semibold leading-tight line-clamp-2">
        {p.title}
      </h2>

      {/* Summary */}
      <p className="text-sm text-muted-foreground line-clamp-2">
        {p.summary}
      </p>

      {/* Condensed metadata */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <time dateTime={p.publishedAt}>
          {formatRelativeDate(p.publishedAt)}
        </time>
        <span>•</span>
        <span>{p.readingTime.minutes} min</span>
      </div>
    </div>
  </div>

  {/* Touch-friendly tap area */}
  <Link 
    href={`/blog/${p.slug}`}
    className="absolute inset-0 z-10"
    aria-label={`Read ${p.title}`}
  >
    <span className="sr-only">Read article</span>
  </Link>
</article>
```

**Enhancements**:
```tsx
// Add swipe actions for mobile
import { motion, useMotionValue, useTransform } from "framer-motion";

export function SwipeablePostCard({ post }: { post: Post }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      style={{ x, opacity }}
      onDragEnd={(_, info) => {
        // Swipe right: bookmark/save
        if (info.offset.x > 100) {
          handleBookmark(post);
        }
        // Swipe left: share
        if (info.offset.x < -100) {
          handleShare(post);
        }
      }}
    >
      {/* PostCard content */}
    </motion.div>
  );
}
```

**Benefits**:
- Better use of mobile screen real estate
- Larger, more engaging thumbnails
- Clearer content hierarchy
- Swipe gestures for power users
- Active state feedback (scale on tap)

---

#### 3. Table of Contents (`table-of-contents.tsx`)

**Current Implementation**:
```tsx
<aside className="hidden lg:block sticky top-20 h-fit">
  <div className="space-y-2">
    <button className="flex w-full items-center justify-between">
      Table of Contents
    </button>
    <ul className="space-y-2 text-sm border-l-2">
      {/* Headings list */}
    </ul>
  </div>
</aside>
```

**Issues**:
- Hidden on mobile (lg:block) - no TOC access
- Sticky sidebar doesn't work well on small screens
- No mobile-friendly alternative provided
- Wastes feature on primary user base (mobile readers)

**Mobile-First Solution**:

##### Floating Action Button with Bottom Sheet
```tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileTableOfContents({ headings }: { headings: Heading[] }) {
  return (
    <>
      {/* Mobile: Floating button */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              aria-label="Table of contents"
            >
              <List className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[70vh] rounded-t-2xl"
          >
            <SheetHeader>
              <SheetTitle>Table of Contents</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 overflow-auto max-h-[calc(70vh-80px)]">
              <ul className="space-y-3">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a
                      href={`#${heading.id}`}
                      className={`
                        block py-2 px-4 rounded-lg text-base
                        transition-colors
                        ${heading.level === 2 ? "font-medium" : "pl-8 text-sm"}
                        hover:bg-muted
                      `}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sticky sidebar (existing) */}
      <aside className="hidden lg:block sticky top-20 h-fit">
        {/* Existing desktop TOC */}
      </aside>
    </>
  );
}
```

**Alternative: Collapsible Header TOC**
```tsx
// For shorter posts, embedded TOC at top
<div className="lg:hidden mb-8">
  <Collapsible>
    <CollapsibleTrigger asChild>
      <Button variant="outline" className="w-full justify-between">
        <span className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent className="mt-3">
      <nav className="border rounded-lg p-4">
        {/* TOC links */}
      </nav>
    </CollapsibleContent>
  </Collapsible>
</div>
```

**Benefits**:
- TOC accessible on all screen sizes
- Doesn't obstruct reading on mobile
- Native bottom sheet UX (familiar pattern)
- Large touch targets for headings
- Smooth scroll with automatic close

---

#### 4. Project Cards (`project-card.tsx`)

**Current Implementation**:
```tsx
<Card className="flex h-full flex-col transition-all hover:shadow-lg hover:-translate-y-1">
  {/* Background image with gradient */}
  <CardHeader className="space-y-3">
    <div className="flex flex-wrap items-center gap-2">
      <CardTitle className="text-base md:text-lg">{title}</CardTitle>
      <Badge>{status}</Badge>
    </div>
    {/* ... description, tech stack ... */}
  </CardHeader>
  
  {showHighlights && highlights && (
    <CardContent>
      <ul className="hidden lg:inline-block list-disc">
        {highlights.map(h => <li key={h}>{h}</li>)}
      </ul>
    </CardContent>
  )}
</Card>
```

**Issues**:
- Highlights completely hidden on mobile (lg:inline-block)
- Hover effect doesn't work on touch devices
- Small badges hard to read
- Link targets inside card compete with card interaction
- No tap feedback

**Mobile-Optimized Version**:

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";

export function MobileProjectCard({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden active:scale-[0.99] transition-transform">
      {/* ... existing header content ... */}

      {/* Mobile: Expandable highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="lg:hidden border-t">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            <span>Key Features</span>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
          
          {expanded && (
            <ul className="px-4 pb-4 space-y-2 text-sm text-muted-foreground">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="text-primary mt-1.5">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Desktop: Always visible highlights */}
      {project.highlights && project.highlights.length > 0 && (
        <CardContent className="hidden lg:block">
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {project.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
        </CardContent>
      )}

      {/* Action buttons - mobile optimized */}
      <CardFooter className="mt-auto flex flex-col sm:flex-row gap-2">
        {project.links.map((link) => (
          <Button
            key={link.href}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-10 justify-center gap-2"
            asChild
          >
            <a href={link.href} target="_blank" rel="noreferrer">
              <span>{link.label}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
```

**Benefits**:
- Progressive disclosure (show more pattern)
- All content accessible on mobile
- Larger, easier to tap buttons
- Visual feedback on interaction
- Stacked buttons on small screens

---

#### 5. Contact Form (`contact-form.tsx`)

**Current Implementation**:
```tsx
<form onSubmit={handleSubmit} className="mt-8 space-y-6">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      name="email"
      type="email"
      placeholder="your.email@example.com"
      autoComplete="email"
      required
    />
  </div>
  {/* ... other fields ... */}
</form>
```

**Issues**:
- No mobile keyboard optimization (inputMode)
- Standard input sizes (no touch optimization)
- No inline validation feedback
- Generic spacing (could be tighter on mobile)
- No clear/reset functionality

**Mobile-Optimized Form**:

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function OptimizedContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time validation
  const validateField = (name: string, value: string) => {
    if (name === "email" && value && !value.includes("@")) {
      return "Please enter a valid email";
    }
    return "";
  };

  return (
    <form className="mt-6 space-y-5">
      {/* Name field with clear button */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">
          Name
        </Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            className="h-12 text-base pr-10"
            required
          />
          {values.name && (
            <button
              type="button"
              onClick={() => setValues({ ...values, name: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear name"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Email with keyboard optimization */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base">
          Email
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => {
              const error = validateField("email", e.target.value);
              setErrors({ ...errors, email: error });
              setValues({ ...values, email: e.target.value });
            }}
            className="h-12 text-base"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message textarea - mobile optimized */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-base">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project..."
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          className="min-h-[120px] text-base resize-none"
          required
        />
        <p className="text-xs text-muted-foreground text-right">
          {values.message.length} characters
        </p>
      </div>

      {/* Submit button - full width on mobile */}
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto h-12 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
```

**Benefits**:
- Proper mobile keyboard types (inputMode)
- Larger touch targets (h-12 = 48px)
- Inline validation with clear feedback
- Clear buttons for easy field reset
- Character counter for textarea
- Full-width submit button on mobile
- Better spacing for thumb typing

---

## Touch Target Optimization

### Current Issues

Analyzing touch targets across the site:

| Element | Current Size | Meets 44px? | Location |
|---------|-------------|-------------|----------|
| Nav links | ~32px | ❌ No | Header |
| Badge elements | ~24px | ❌ No | Posts, Projects |
| Tag filters | ~28px | ❌ No | Blog page |
| Card links | Variable | ⚠️ Maybe | Post cards |
| Form inputs | 40px | ⚠️ Close | Forms |
| Buttons | 40px | ⚠️ Close | Various |
| Theme toggle | 40px | ⚠️ Close | Header |

### Recommendations

#### 1. Create Touch Target Utilities

```tsx
// src/lib/touch-targets.ts

/**
 * Ensures minimum 44x44px touch target per Apple/Google guidelines
 * Uses pseudo-element to expand hit area without affecting visual size
 */
export const touchTarget = `
  relative
  before:absolute 
  before:inset-0
  before:min-h-[44px]
  before:min-w-[44px]
  before:-translate-x-1/2
  before:-translate-y-1/2
  before:left-1/2
  before:top-1/2
`;

// Spacing between touch targets (minimum 8px)
export const touchSpacing = "gap-3"; // 12px = 8px + wiggle room
```

#### 2. Update Navigation

```tsx
// site-header.tsx
<nav className="flex items-center gap-3">
  <Link 
    href="/about" 
    className="py-3 px-2 hover:text-primary transition-colors min-h-[44px] flex items-center"
  >
    About
  </Link>
  {/* More links with consistent touch targets */}
</nav>
```

#### 3. Update Badges for Filtering

```tsx
// blog/page.tsx - Tag filters
<Badge 
  asChild 
  variant={tag ? "outline" : "secondary"}
  className="h-10 px-4" // Explicit height for touch
>
  <Link href={buildTagHref("", query)}>All</Link>
</Badge>
```

#### 4. Form Input Standards

```tsx
// Update all shadcn/ui Input components
// src/components/ui/input.tsx

const inputVariants = cva(
  "...",
  {
    variants: {
      size: {
        default: "h-10",
        lg: "h-12", // 48px - better for mobile
        xl: "h-14", // 56px - maximum comfort
      },
    },
    defaultVariants: {
      size: "lg", // Use lg by default on mobile
    },
  }
);
```

---

## Responsive Spacing System

### Current Padding Analysis

```tsx
// Most components use:
className="px-6 md:px-8" // Only 8px difference

// Container widths:
className="mx-auto max-w-5xl" // 80rem = 1280px
```

### Improved Mobile-First Spacing

```tsx
// Tailwind config - add custom spacing scale
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)', // iOS notch
        'safe-top': 'env(safe-area-inset-top)',
      },
      padding: {
        'page-mobile': '1rem', // 16px - comfortable on small screens
        'page-tablet': '1.5rem', // 24px
        'page-desktop': '2rem', // 32px
      },
    },
  },
};
```

```tsx
// Use progressive padding
<div className="px-page-mobile sm:px-page-tablet lg:px-page-desktop">
  {/* Content */}
</div>

// Account for bottom navigation on mobile
<main className="pb-20 md:pb-0"> // 80px for bottom nav
  {/* Page content */}
</main>

// Safe area for notched devices
<header className="pt-safe-top">
  {/* Header content */}
</header>
```

---

## Performance Optimizations

### 1. Reduce JavaScript for Mobile

```tsx
// Use progressive enhancement
// Only load heavy components on larger screens

// Example: GitHub heatmap
"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hooks/use-media-query";

const GitHubHeatmap = dynamic(
  () => import("@/components/github-heatmap").then(mod => mod.GitHubHeatmap),
  { 
    ssr: false,
    loading: () => <GitHubHeatmapSkeleton />
  }
);

export function ConditionalHeatmap() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  if (!isDesktop) {
    return <GitHubHeatmapMobileCard />; // Simplified mobile version
  }
  
  return <GitHubHeatmap />;
}
```

### 2. Image Optimization

```tsx
// Serve appropriately sized images
<Image
  src={post.image}
  alt={post.title}
  width={800}
  height={450}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
  quality={85} // Lower quality for mobile (saves bandwidth)
  priority={index < 2} // Only prioritize above-fold
/>
```

### 3. Font Loading Strategy

```tsx
// layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true, // Reduce CLS
});
```

---

## Gesture Support

### 1. Swipe Navigation for Blog Posts

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useSwipeable } from "react-swipeable";

export function SwipeableBlogPost({ 
  prevSlug, 
  nextSlug, 
  children 
}: { 
  prevSlug?: string;
  nextSlug?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (nextSlug) {
        router.push(`/blog/${nextSlug}`);
      }
    },
    onSwipedRight: () => {
      if (prevSlug) {
        router.push(`/blog/${prevSlug}`);
      }
    },
    trackMouse: false, // Only touch, not mouse
    trackTouch: true,
    delta: 50, // Minimum swipe distance
    preventScrollOnSwipe: false,
  });
  
  return (
    <div {...handlers} className="min-h-screen">
      {children}
      
      {/* Visual indicators */}
      {prevSlug && (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 md:hidden">
          <div className="text-muted-foreground opacity-50">
            <ChevronLeft className="h-6 w-6" />
          </div>
        </div>
      )}
      {nextSlug && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 md:hidden">
          <div className="text-muted-foreground opacity-50">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      )}
    </div>
  );
}
```

### 2. Pull-to-Refresh for Blog List

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pulling, setPulling] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY > 0) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 80) {
      setPulling(true);
    }
  };

  const handleTouchEnd = async () => {
    if (pulling) {
      router.refresh();
      setPulling(false);
    }
    setStartY(0);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pulling && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      {children}
    </div>
  );
}
```

---

## PWA Enhancements

### 1. Web App Manifest

```json
// public/manifest.json
{
  "name": "Drew's Lab",
  "short_name": "Drew's Lab",
  "description": "Cybersecurity architect and developer portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Latest Posts",
      "url": "/blog",
      "icons": [{ "src": "/icons/blog-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Projects",
      "url": "/projects",
      "icons": [{ "src": "/icons/projects-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

### 2. Add to Home Screen Prompt

```tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after user has been on site for 30 seconds
      setTimeout(() => {
        const dismissed = localStorage.getItem("install-prompt-dismissed");
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("install-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50">
      <div className="bg-card border rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Install Drew's Lab</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Add to your home screen for quick access and offline reading.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss}>
                Not now
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Priority: P0 - Critical**

- [ ] Touch target audit and fixes
  - Update all interactive elements to min 44x44px
  - Add proper spacing between touch targets
  - Implement touch target utilities
- [ ] Mobile navigation
  - Implement hamburger menu with Sheet
  - Ensure proper focus management
  - Add keyboard shortcuts
- [ ] Form optimization
  - Add inputMode attributes
  - Increase input heights to 48px
  - Implement inline validation
- [ ] Responsive spacing
  - Update container padding system
  - Add safe area insets
  - Account for bottom navigation

**Success Metrics**:
- All touch targets ≥ 44x44px
- Form completion rate increase
- Reduced misclick rate

### Phase 2: Navigation & Structure (Week 2)
**Priority: P1 - High**

- [ ] Bottom navigation bar
  - Create MobileNav component
  - Add visual feedback for active route
  - Test with various devices
- [ ] Mobile Table of Contents
  - Floating action button
  - Bottom sheet with headings
  - Smooth scroll implementation
- [ ] Project card optimization
  - Progressive disclosure for highlights
  - Larger touch targets for actions
  - Improved mobile layout
- [ ] Post list mobile redesign
  - Vertical card layout
  - Full-width thumbnails
  - Optimized metadata display

**Success Metrics**:
- Improved navigation efficiency
- Increased TOC usage on mobile
- Better content engagement

### Phase 3: Interactions (Week 3)
**Priority: P1 - High**

- [ ] Swipe gestures
  - Blog post navigation (prev/next)
  - Card actions (bookmark, share)
  - Pull-to-refresh for lists
- [ ] Loading states
  - Skeleton shimmer effect
  - Progressive content loading
  - Optimistic UI updates
- [ ] Haptic feedback (iOS)
  - Button taps
  - Gesture completions
  - Success/error notifications
- [ ] Active states
  - Scale feedback on tap
  - Ripple effects for cards
  - Visual confirmation

**Success Metrics**:
- Gesture adoption rate
- Perceived performance improvement
- User satisfaction scores

### Phase 4: Performance (Week 4)
**Priority: P2 - Medium**

- [ ] Code splitting
  - Route-based splitting
  - Component lazy loading
  - Conditional loading by viewport
- [ ] Image optimization
  - Mobile-specific sizes
  - Blur placeholders
  - Priority hints
- [ ] Font loading
  - Reduce font weights
  - Subset for performance
  - Optimize fallbacks
- [ ] Bundle size reduction
  - Analyze dependencies
  - Remove unused code
  - Tree-shake aggressively

**Success Metrics**:
- LCP < 2.5s on 3G
- FID < 100ms
- CLS < 0.1
- Bundle size reduction 20%

### Phase 5: PWA & Polish (Week 5)
**Priority: P2 - Medium**

- [ ] PWA setup
  - Web app manifest
  - Service worker
  - Install prompt
  - Offline fallback
- [ ] Advanced interactions
  - Long-press menus
  - Double-tap actions
  - Pinch-to-zoom (images)
- [ ] Micro-animations
  - Page transitions
  - Scroll-triggered effects
  - Loading animations
- [ ] Accessibility
  - Screen reader testing
  - Voice-over optimization
  - High contrast mode
  - Reduced motion support

**Success Metrics**:
- PWA install rate
- Return visitor rate
- Accessibility score 100
- User engagement increase

---

## Testing Strategy

### Device Matrix

| Device | Viewport | Priority | Test Focus |
|--------|----------|----------|------------|
| iPhone SE | 375x667 | P0 | Small screen layout, touch targets |
| iPhone 14 Pro | 393x852 | P0 | Notch handling, safe areas |
| iPad Mini | 768x1024 | P1 | Tablet layout, touch vs desktop |
| Samsung Galaxy | 360x740 | P0 | Android gestures, Chrome mobile |
| iPad Pro | 1024x1366 | P2 | Large tablet, hybrid patterns |

### Key Test Scenarios

1. **Navigation Flow**
   - Open mobile menu → navigate to page → back
   - Bottom nav switching between sections
   - TOC usage on long blog posts

2. **Form Interaction**
   - Contact form completion
   - Field validation
   - Keyboard handling
   - Error recovery

3. **Content Consumption**
   - Blog post reading (scroll, TOC, share)
   - Project browsing (cards, expand, links)
   - Search and filter (blog tags, query)

4. **Gesture Tests**
   - Swipe left/right on blog posts
   - Pull-to-refresh on blog list
   - Pinch-to-zoom on images
   - Long-press context menu

5. **Performance**
   - Cold start (first visit)
   - Warm start (cached)
   - Navigation speed
   - Interaction response

### Tools

- **Chrome DevTools**: Device emulation, network throttling
- **Lighthouse**: Performance, accessibility, PWA audit
- **BrowserStack**: Real device testing
- **React DevTools**: Component profiling
- **Bundle Analyzer**: JavaScript size analysis

---

## Success Metrics

### Quantitative KPIs

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Mobile Bounce Rate | TBD | < 40% | P0 |
| Time on Page (Mobile) | TBD | > 2 min | P1 |
| Form Completion (Mobile) | TBD | > 60% | P0 |
| Page Load (3G) | TBD | < 3s | P0 |
| Lighthouse Performance | TBD | > 90 | P1 |
| Lighthouse Accessibility | TBD | 100 | P0 |
| PWA Install Rate | 0% | > 5% | P2 |
| Return Visitor Rate | TBD | > 40% | P2 |

### Qualitative Goals

- [ ] Navigation feels intuitive and familiar
- [ ] Content is readable without zooming
- [ ] Forms are easy to complete on mobile
- [ ] Site feels fast and responsive
- [ ] Interactions provide clear feedback
- [ ] Mobile experience matches native app quality

---

## Next Steps

1. **Review & Prioritize**: Stakeholder alignment on roadmap
2. **Prototype**: Build mobile navigation proof-of-concept
3. **User Testing**: Validate assumptions with real users
4. **Iterate**: Refine based on feedback
5. **Implement**: Execute phased rollout
6. **Measure**: Track KPIs and adjust

---

## References

- [Apple Human Interface Guidelines - Touch Targets](https://developer.apple.com/design/human-interface-guidelines/touchscreen-gestures)
- [Google Material Design - Touch Targets](https://m3.material.io/foundations/accessible-design/accessibility-basics#28032e45-c598-450c-b355-f9fe737b1cd8)
- [Web.dev - Mobile UX Best Practices](https://web.dev/mobile-ux/)
- [A11y Project - Mobile Accessibility](https://www.a11yproject.com/checklist/#mobile)
- [PWA Best Practices](https://web.dev/pwa-checklist/)

---

**Document Version**: 1.0  
**Last Updated**: November 4, 2025  
**Author**: GitHub Copilot (Analysis Request)
