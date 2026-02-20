import { posts, featuredPosts } from '@/data/posts';
import { getSocialUrls } from '@/data/socials';
import {
  SITE_URL,
  SITE_TITLE,
  AUTHOR_NAME,
  getOgImageUrl,
  SITE_TITLE_PLAIN,
  SITE_LAUNCH_DATE,
  SITE_LAST_UPDATED_DATE,
} from '@/lib/site-config';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import {
  TYPOGRAPHY,
  SPACING,
  PAGE_LAYOUT,
  CONTAINER_WIDTHS,
  SCROLL_BEHAVIOR,
  CONTAINER_VERTICAL_PADDING,
  ANIMATION,
  CONTAINER_PADDING,
} from '@/lib/design-tokens';
import { createPageMetadata, getJsonLdScriptProps } from '@/lib/metadata';
import { PageLayout } from '@/components/layouts';
import { cn } from '@/lib/utils';
import {
  SectionHeader,
  SiteLogo,
  SectionNavigator,
  Section,
  SmoothScrollToHash,
} from '@/components/common';
// Import components for loading fallbacks (using loading prop pattern)
import { FeaturedPostHero as FeaturedPostHeroComponent, QuickLinksRibbon } from '@/components/home';
import { SearchButton } from '@/components/search';

// Lazy-loaded below-fold components for better initial load performance
// Using new loading prop pattern - components render their own skeletons
const FeaturedPostHero = dynamic(
  () =>
    import('@/components/home').then((mod) => ({
      default: mod.FeaturedPostHero,
    })),
  {
    loading: () => <FeaturedPostHeroComponent loading />,
  }
);

// Optimized meta description for homepage (158 characters - within 150-160 range)
const pageDescription =
  'Discover insights on cyber architecture, coding, and security at DCYFR Labs. Explore our latest articles, projects, and innovative solutions.';

export const metadata: Metadata = createPageMetadata({
  title: SITE_TITLE_PLAIN,
  description: pageDescription,
  path: '/',
});

export default async function Home() {
  // Get nonce from proxy for CSP
  const nonce = (await headers()).get('x-nonce') || '';

  // Get featured post for hero section
  const featuredPost = featuredPosts[0];

  const socialImage = getOgImageUrl();
  // JSON-LD structured data for home page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: pageDescription,
        publisher: {
          '@id': `${SITE_URL}/#person`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: SITE_URL,
        image: socialImage,
        description: pageDescription,
        jobTitle: 'Founding Architect',
        sameAs: getSocialUrls(),
        knowsAbout: [
          'Cybersecurity',
          'Artificial Intelligence',
          'Web Development',
          'Cloud Security',
          'Risk Management',
          'Incident Response',
          'Compliance',
          'DevSecOps',
          'Programming',
          'Information Security',
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SITE_TITLE,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#person`,
        },
        description: pageDescription,
        inLanguage: 'en-US',
        image: socialImage,
        datePublished: SITE_LAUNCH_DATE,
        dateModified: SITE_LAST_UPDATED_DATE,
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faqpage`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is DCYFR Labs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'DCYFR Labs is a virtual partnership dedicated to building secure, innovative solutions for the modern web. We publish in-depth insights on cyber architecture, information security, artificial intelligence, and software development.',
            },
          },
          {
            '@type': 'Question',
            name: 'What topics does DCYFR Labs cover?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'DCYFR Labs covers cybersecurity, artificial intelligence, cloud security, DevSecOps, web development, risk management, incident response, and practical programming techniques.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who creates content at DCYFR Labs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Content at DCYFR Labs is created by experienced practitioners in cybersecurity and software engineering, led by Drew — a founding architect with expertise across security architecture, AI, and modern web development.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I read the latest articles on DCYFR Labs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Browse all articles at dcyfr.ai/blog, or use the search feature on the homepage. You can filter content by topic, tag, or reading time to find exactly what you need.',
            },
          },
        ],
      },
    ],
  };

  // Calculate stats for homepage
  const activePosts = posts.filter((p) => !p.archived);

  // Calculate topic data for TopicNavigator
  const tagCounts = new Map<string, number>();
  activePosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return (
    <PageLayout>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      <SmoothScrollToHash />

      <SectionNavigator scrollOffset={SCROLL_BEHAVIOR.offset.standard} className={SPACING.section}>
        <Section
          id="hero"
          className="relative flex items-center justify-center min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] xl:min-h-[80vh]"
        >
          {/* Hero Content - Centered and Minimal */}
          <div
            className={cn(
              'w-full max-w-3xl mx-auto text-center',
              CONTAINER_PADDING,
              'opacity-0 translate-y-2 animate-fade-in-up'
            )}
            style={{
              animationDelay: '150ms',
              animationFillMode: 'forwards',
            }}
          >
            {/* Logo - Subtle presence */}
            <div className="mb-2 flex justify-center">
              {/* Semantic H1 for AI/screen-reader citation-readiness — visually hidden */}
              <h1 className="sr-only">
                DCYFR Labs — Cyber Architecture, Security &amp; Development Insights
              </h1>
              <SiteLogo size="lg" />
            </div>

            {/* Subheadline - Supportive description */}
            <p className={cn(TYPOGRAPHY.description, 'text-muted-foreground mb-4')}>
              Emerging technology, security insights, and practical code.
            </p>

            {/* Search - Primary CTA */}
            <div className="mx-auto mb-4 mt-12 max-w-xl">
              <SearchButton variant="input" />
            </div>
          </div>
        </Section>
      </SectionNavigator>
    </PageLayout>
  );
}
