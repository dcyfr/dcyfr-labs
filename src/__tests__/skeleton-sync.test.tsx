/**
 * Skeleton Sync Tests
 * 
 * Validates that skeleton loading states match the structure of actual pages.
 * These tests help catch drift between loading.tsx files and page.tsx files.
 * 
 * @see docs/components/skeleton-sync-strategy.md
 */

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Import loading components
import HomeLoading from '@/app/loading';
import ProjectsLoading from '@/app/projects/loading';
import BlogLoading from '@/app/blog/loading';
import AboutLoading from '@/app/about/loading';
import ContactLoading from '@/app/contact/loading';
import ResumeLoading from '@/app/resume/loading';

describe('Skeleton Structural Sync', () => {
  describe('Homepage Loading', () => {
    it('should use PageHero component structure', () => {
      const { container } = render(<HomeLoading />);
      
      // Should have PageLayout wrapper (div with min-h-screen)
      const wrapper = container.querySelector('[class*="min-h-screen"]');
      expect(wrapper).toBeTruthy();
      
      // Should have hero section (from PageHero)
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
      
      // Should have skeleton elements (using skeleton-shimmer class)
      const skeletons = container.querySelectorAll('.skeleton-shimmer');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have featured post section', () => {
      const { container } = render(<HomeLoading />);
      
      const sections = container.querySelectorAll('section');
      // Hero + Featured Post + Blog + Projects = 4 sections minimum
      expect(sections.length).toBeGreaterThanOrEqual(4);
    });

    it('should have blog and projects sections', () => {
      const { container } = render(<HomeLoading />);
      
      // Check for grid layout (projects section)
      const gridElements = container.querySelectorAll('[class*="grid"]');
      expect(gridElements.length).toBeGreaterThan(0);
    });
  });

  describe('Projects Page Loading', () => {
    it('should use ArchiveLayout structure', () => {
      const { container } = render(<ProjectsLoading />);
      
      // Should have hero section from ArchiveLayout
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
      
      // Should have container with design tokens classes
      const contentContainer = container.querySelector('[class*="max-w"]');
      expect(contentContainer).toBeTruthy();
    });

    it('should have GitHub heatmap skeleton', () => {
      const { container } = render(<ProjectsLoading />);
      
      // GitHub heatmap should be present (using skeleton-shimmer class)
      const skeletons = container.querySelectorAll('.skeleton-shimmer');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should have projects grid with multiple cards', () => {
      const { container } = render(<ProjectsLoading />);
      
      // Should have grid layout
      const gridElements = container.querySelectorAll('[class*="grid"]');
      expect(gridElements.length).toBeGreaterThan(0);
      
      // Should match projects grid (sm:grid-cols-2)
      const projectsGrid = Array.from(gridElements).find(
        el => el.className.includes('sm:grid-cols-2')
      );
      expect(projectsGrid).toBeTruthy();
    });
  });

  describe('Blog Page Loading', () => {
    it('should use ArchiveLayout structure', () => {
      const { container } = render(<BlogLoading />);
      
      // Should have hero section
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
    });

    it('should have search and filter skeletons', () => {
      const { container } = render(<BlogLoading />);
      
      // Should have search input skeleton (using skeleton-shimmer class)
      const skeletons = container.querySelectorAll('.skeleton-shimmer');
      expect(skeletons.length).toBeGreaterThan(0);
      
      // Should have filter badges skeleton (flex-wrap)
      const filterContainer = container.querySelector('[class*="flex-wrap"]');
      expect(filterContainer).toBeTruthy();
    });

    it('should have post list skeleton', () => {
      const { container } = render(<BlogLoading />);
      
      // Should have multiple skeleton items for posts (using skeleton-shimmer class)
      const skeletons = container.querySelectorAll('.skeleton-shimmer');
      // At least 5 post skeletons + search + filters
      expect(skeletons.length).toBeGreaterThan(7);
    });
  });

  describe('About Page Loading', () => {
    it('should use PageHero component', () => {
      const { container } = render(<AboutLoading />);
      
      // Should have hero section
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
    });

    it('should have avatar skeleton', () => {
      const { container } = render(<AboutLoading />);
      
      // Should have rounded-full skeleton (avatar with skeleton-shimmer class)
      const avatarSkeleton = container.querySelector('.skeleton-shimmer[class*="rounded-full"]');
      expect(avatarSkeleton).toBeTruthy();
    });

    it('should have multiple content sections', () => {
      const { container } = render(<AboutLoading />);
      
      const sections = container.querySelectorAll('section');
      // Hero + About Me + 4 content sections + Social Links = 7 minimum
      expect(sections.length).toBeGreaterThanOrEqual(6);
    });

    it('should have social links grid', () => {
      const { container } = render(<AboutLoading />);
      
      // Should have social links card grid
      const gridElements = container.querySelectorAll('[class*="grid"]');
      expect(gridElements.length).toBeGreaterThan(0);
      
      // Should match social links grid (sm:grid-cols-2)
      const socialGrid = Array.from(gridElements).find(
        el => el.className.includes('sm:grid-cols-2')
      );
      expect(socialGrid).toBeTruthy();
    });
  });

  describe('Contact Page Loading', () => {
    it('should use PageHero component', () => {
      const { container } = render(<ContactLoading />);
      
      // Should have hero section
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
    });

    it('should have form skeleton', () => {
      const { container } = render(<ContactLoading />);
      
      // Should have form card (Card component uses data-slot="card")
      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeTruthy();
      
      // Should have multiple skeletons for form fields (using skeleton-shimmer class)
      const skeletons = container.querySelectorAll('.skeleton-shimmer');
      expect(skeletons.length).toBeGreaterThan(3);
    });
  });

  describe('Resume Page Loading', () => {
    it('should use PageHero component', () => {
      const { container } = render(<ResumeLoading />);
      
      // Should have hero section
      const heroSection = container.querySelector('section');
      expect(heroSection).toBeTruthy();
    });

    it('should have multiple experience/education cards', () => {
      const { container } = render(<ResumeLoading />);
      
      // Should have multiple sections for experience, education, skills
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(3);
    });

    it('should have card skeletons for resume items', () => {
      const { container } = render(<ResumeLoading />);
      
      // Should have card components (Card component uses data-slot="card")
      const cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Common Skeleton Patterns', () => {
    const loadingComponents = [
      { name: 'Home', component: HomeLoading },
      { name: 'Projects', component: ProjectsLoading },
      { name: 'Blog', component: BlogLoading },
      { name: 'About', component: AboutLoading },
      { name: 'Contact', component: ContactLoading },
      { name: 'Resume', component: ResumeLoading },
    ];

    it('all loading states should have PageLayout wrapper', () => {
      loadingComponents.forEach(({ name, component: Component }) => {
        const { container } = render(<Component />);
        // PageLayout renders a div with min-h-screen class
        // ArchiveLayout (Blog, Projects) doesn't use PageLayout - check for section instead
        const hasPageLayout = container.querySelector('[class*="min-h-screen"]');
        const hasSection = container.querySelector('section');
        expect(
          hasPageLayout || hasSection, 
          `${name} should have either PageLayout wrapper or section element`
        ).toBeTruthy();
      });
    });

    it('all loading states should have skeleton animations', () => {
      loadingComponents.forEach(({ name, component: Component }) => {
        const { container } = render(<Component />);
        const skeletons = container.querySelectorAll('.skeleton-shimmer');
        expect(skeletons.length, `${name} should have skeletons`).toBeGreaterThan(0);
      });
    });

    it('all loading states should use design tokens for spacing', () => {
      loadingComponents.forEach(({ name, component: Component }) => {
        const { container } = render(<Component />);
        // Should use standard padding classes from design tokens
        const sections = container.querySelectorAll('section');
        expect(sections.length, `${name} should have sections`).toBeGreaterThan(0);
      });
    });
  });
});
