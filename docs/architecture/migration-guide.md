# Migration Guide: Creating Archive & Article Pages

**Last Updated:** November 10, 2025  
**Status:** Production-ready patterns from Phase 1-3 refactoring

This guide shows you how to create new archive (list/grid) pages and article (individual item) pages using the centralized infrastructure from the Architecture Refactoring project.

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Archive Pages (Lists/Grids)](#archive-pages-listsgrids)
3. [Article Pages (Individual Items)](#article-pages-individual-items)
4. [Metadata Generation](#metadata-generation)
5. [JSON-LD Schemas](#json-ld-schemas)
6. [Custom Patterns](#custom-patterns)
7. [Complete Examples](#complete-examples)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### What You Get

The refactoring provides:

✅ **Type-safe utilities** for filtering, sorting, pagination  
✅ **Centralized metadata** generation (OG, Twitter, JSON-LD)  
✅ **Universal layouts** for consistent structure  
✅ **CSP compliance** built-in (nonce support)  
✅ **Proven patterns** from `/blog` and `/projects`

### Core Libraries

```typescript
import { getArchiveData } from '@/lib/archive'        // List pages
import { getArticleData } from '@/lib/article'        // Individual items
import { createArchivePageMetadata } from '@/lib/metadata'  // Metadata
```

### When to Use

**Archive Pattern** → Any list/grid page:
- `/blog` - Blog posts list
- `/projects` - Projects grid
- `/notes` - Notes archive (future)
- `/writing` - Writing portfolio (future)

**Article Pattern** → Any individual item page:
- `/blog/[slug]` - Individual blog post
- `/projects/[slug]` - Individual project (future)
- `/notes/[slug]` - Individual note (future)

---

## 📋 Archive Pages (Lists/Grids)

Archive pages display collections of items with filtering, sorting, and pagination.

### 1. Basic Archive Page

**File:** `src/app/writing/page.tsx`

```typescript
import { Suspense } from 'react'
import { ArchiveLayout } from '@/components/layouts/archive-layout'
import { ArchiveFilters } from '@/components/layouts/archive-filters'
import { ArchivePagination } from '@/components/layouts/archive-pagination'
import { getArchiveData } from '@/lib/archive'
import { createArchivePageMetadata, createCollectionSchema, getJsonLdScriptProps } from '@/lib/metadata'
import { getNonce } from '@/lib/csp'
import { articles } from '@/data/articles' // Your data source

// Type for your items
type Article = {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  featured?: boolean
}

// Generate metadata
export async function generateMetadata() {
  return createArchivePageMetadata({
    title: 'Writing',
    description: 'Articles and essays about technology, design, and development',
    path: '/writing',
    itemCount: articles.length,
  })
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const nonce = getNonce()

  // Get filtered, sorted, paginated data
  const archiveData = getArchiveData<Article>({
    items: articles,
    searchParams: params,
    config: {
      searchFields: ['title', 'excerpt', 'tags'],
      sortOptions: {
        newest: { field: 'publishedAt', order: 'desc' },
        oldest: { field: 'publishedAt', order: 'asc' },
        title: { field: 'title', order: 'asc' },
      },
      defaultSort: 'newest',
      itemsPerPage: 12,
    },
  })

  const { items, pagination, filters } = archiveData

  // Generate JSON-LD
  const jsonLd = createCollectionSchema({
    name: 'Writing Archive',
    description: 'Articles and essays',
    url: 'https://yourdomain.com/writing',
    items: items.map(article => ({
      name: article.title,
      description: article.excerpt,
      url: `https://yourdomain.com/writing/${article.slug}`,
      datePublished: new Date(article.publishedAt),
    })),
  })

  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      
      <ArchiveLayout
        title="Writing"
        description="Articles and essays about technology, design, and development"
        itemCount={items.length}
        filters={
          <ArchiveFilters
            currentQuery={filters.query}
            selectedTags={filters.tags}
            availableTags={filters.availableTags}
            basePath="/writing"
          />
        }
        pagination={
          pagination.totalPages > 1 ? (
            <ArchivePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/writing"
            />
          ) : null
        }
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </ArchiveLayout>
    </>
  )
}
```

### 2. Archive with Custom Filters

If you need domain-specific filters (like reading time for blog posts), create a custom filter component:

```typescript
// src/components/filters/writing-filters.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function WritingFilters({
  currentQuery,
  selectedTags,
  availableTags,
  basePath,
}: {
  currentQuery: string
  selectedTags: string[]
  availableTags: string[]
  basePath: string
}) {
  // Your custom filter logic
  return (
    <div className="space-y-4">
      {/* Search */}
      <Input placeholder="Search articles..." defaultValue={currentQuery} />
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {availableTags.map(tag => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      
      {/* Custom filter: Article type */}
      <select>
        <option value="all">All Types</option>
        <option value="tutorial">Tutorials</option>
        <option value="essay">Essays</option>
      </select>
    </div>
  )
}
```

Then use it in your page:

```typescript
<ArchiveLayout
  filters={
    <WritingFilters
      currentQuery={filters.query}
      selectedTags={filters.tags}
      availableTags={filters.availableTags}
      basePath="/writing"
    />
  }
  // ... rest
>
```

**See:** `/blog/page.tsx` uses custom `BlogFilters` for reading time and layout toggle.

---

## 📄 Article Pages (Individual Items)

Article pages display individual items with navigation and related content.

### 1. Basic Article Page

**File:** `src/app/writing/[slug]/page.tsx`

```typescript
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/layouts/article-layout'
import { getArticleData } from '@/lib/article'
import { 
  createArticlePageMetadata, 
  createArticleSchema, 
  createBreadcrumbSchema,
  getJsonLdScriptProps 
} from '@/lib/metadata'
import { getNonce } from '@/lib/csp'
import { articles } from '@/data/articles'

export async function generateStaticParams() {
  return articles.map(article => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles.find(a => a.slug === slug)
  if (!article) return {}

  return createArticlePageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/writing/${article.slug}`,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    tags: article.tags,
    // Optional: hero image
    heroImage: article.image ? {
      url: article.image,
      alt: article.imageAlt || article.title,
      width: 1200,
      height: 630,
    } : undefined,
  })
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const nonce = getNonce()
  
  const article = articles.find(a => a.slug === slug)
  if (!article) notFound()

  // Get navigation and related articles
  const articleData = getArticleData({
    item: article,
    allItems: articles,
    relatedFields: ['tags'],
    idField: 'slug',
    dateField: 'publishedAt',
    maxRelated: 3,
  })

  // Generate JSON-LD
  const articleSchema = createArticleSchema({
    headline: article.title,
    description: article.excerpt,
    url: `https://yourdomain.com/writing/${article.slug}`,
    datePublished: new Date(article.publishedAt),
    dateModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
    author: { name: article.author },
    image: article.image,
    keywords: article.tags,
  })

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://yourdomain.com' },
    { name: 'Writing', url: 'https://yourdomain.com/writing' },
    { name: article.title, url: `https://yourdomain.com/writing/${article.slug}` },
  ])

  return (
    <>
      <script {...getJsonLdScriptProps(articleSchema, nonce)} />
      <script {...getJsonLdScriptProps(breadcrumbSchema, nonce)} />
      
      <ArticleLayout>
        <article>
          <header>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString()}
            </time>
          </header>
          
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          
          {/* Navigation */}
          {articleData.navigation.previous && (
            <a href={`/writing/${articleData.navigation.previous.slug}`}>
              ← {articleData.navigation.previous.title}
            </a>
          )}
          {articleData.navigation.next && (
            <a href={`/writing/${articleData.navigation.next.slug}`}>
              {articleData.navigation.next.title} →
            </a>
          )}
          
          {/* Related articles */}
          {articleData.relatedItems.length > 0 && (
            <section>
              <h2>Related Articles</h2>
              <ul>
                {articleData.relatedItems.map(related => (
                  <li key={related.slug}>
                    <a href={`/writing/${related.slug}`}>{related.title}</a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </ArticleLayout>
    </>
  )
}
```

---

## 🏷️ Metadata Generation

All metadata helpers are in `src/lib/metadata.ts`.

### Page Metadata

```typescript
import { createPageMetadata } from '@/lib/metadata'

export const metadata = createPageMetadata({
  title: 'About Me',
  description: 'Learn about my background and experience',
  path: '/about',
})
```

### Archive Page Metadata

```typescript
import { createArchivePageMetadata } from '@/lib/metadata'

export const metadata = createArchivePageMetadata({
  title: 'Blog',
  description: 'Technical articles and tutorials',
  path: '/blog',
  itemCount: posts.length,
  // Optional: custom hero image
  heroImage: {
    url: '/images/blog-hero.jpg',
    alt: 'Blog hero image',
  },
})
```

### Article Page Metadata

```typescript
import { createArticlePageMetadata } from '@/lib/metadata'

export const metadata = createArticlePageMetadata({
  title: post.title,
  description: post.excerpt,
  path: `/blog/${post.slug}`,
  publishedTime: post.publishedAt,
  modifiedTime: post.updatedAt,
  authors: [post.author],
  tags: post.tags,
  heroImage: post.image ? {
    url: post.image,
    alt: post.imageAlt || post.title,
    width: 1200,
    height: 630,
  } : undefined,
})
```

**Benefits:**
- ✅ Automatic title templating (`Title | Site Name`)
- ✅ OG and Twitter cards generated automatically
- ✅ Fallback to default OG images
- ✅ Type-safe with IntelliSense

---

## 🔗 JSON-LD Schemas

All schema helpers are in `src/lib/metadata.ts`.

### Collection Schema (Archive Pages)

```typescript
import { createCollectionSchema, getJsonLdScriptProps } from '@/lib/metadata'

const jsonLd = createCollectionSchema({
  name: 'Blog Posts',
  description: 'Technical articles and tutorials',
  url: 'https://yourdomain.com/blog',
  items: posts.map(post => ({
    name: post.title,
    description: post.excerpt,
    url: `https://yourdomain.com/blog/${post.slug}`,
    datePublished: new Date(post.publishedAt),
    author: post.author,
  })),
})

// In your component:
<script {...getJsonLdScriptProps(jsonLd, nonce)} />
```

### Article Schema (Individual Pages)

```typescript
import { createArticleSchema, getJsonLdScriptProps } from '@/lib/metadata'

const jsonLd = createArticleSchema({
  headline: post.title,
  description: post.excerpt,
  url: `https://yourdomain.com/blog/${post.slug}`,
  datePublished: new Date(post.publishedAt),
  dateModified: new Date(post.updatedAt),
  author: { name: post.author, url: 'https://yourdomain.com' },
  image: post.image,
  keywords: post.tags,
})

<script {...getJsonLdScriptProps(jsonLd, nonce)} />
```

### Breadcrumb Schema

```typescript
import { createBreadcrumbSchema, getJsonLdScriptProps } from '@/lib/metadata'

const jsonLd = createBreadcrumbSchema([
  { name: 'Home', url: 'https://yourdomain.com' },
  { name: 'Blog', url: 'https://yourdomain.com/blog' },
  { name: post.title, url: `https://yourdomain.com/blog/${post.slug}` },
])

<script {...getJsonLdScriptProps(jsonLd, nonce)} />
```

### Custom Schema

For domain-specific schemas (like SoftwareSourceCode for projects), create them manually:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  'name': project.title,
  'description': project.description,
  'codeRepository': project.github,
  'programmingLanguage': project.tech,
  // ... your custom fields
}

<script {...getJsonLdScriptProps(jsonLd, nonce)} />
```

**See:** `/projects/page.tsx` uses custom SoftwareSourceCode schema.

---

## 🎨 Custom Patterns

### When to Use Generic vs Custom

**Use Generic Patterns:**
- ✅ Standard list/grid layouts
- ✅ Basic filtering and sorting
- ✅ Common metadata (title, description, OG)
- ✅ Standard JSON-LD (Collection, Article, Breadcrumb)

**Use Custom Patterns:**
- ✅ Domain-specific filters (reading time, project type)
- ✅ Unique layouts (magazine view, kanban board)
- ✅ Custom JSON-LD types (SoftwareSourceCode, Recipe, Product)
- ✅ Special features (view counts, comments, ratings)

**Examples:**
- **Generic:** `/projects/page.tsx` uses `ArchiveLayout` + custom SoftwareSourceCode schema
- **Custom:** `/blog/page.tsx` uses `BlogFilters` for reading time and layout toggle
- **Both:** `/blog/[slug]/page.tsx` uses `ArticleLayout` + custom view tracking

### Extending Archive Utilities

Add custom filtering logic:

```typescript
import { getArchiveData, type ArchiveConfig } from '@/lib/archive'

// Custom filter for featured items
function filterFeatured<T extends { featured?: boolean }>(items: T[], showFeatured: boolean) {
  if (!showFeatured) return items
  return items.filter(item => item.featured === true)
}

// Use in your page
const archiveData = getArchiveData<Article>({
  items: filterFeatured(articles, params.featured === 'true'),
  searchParams: params,
  config: { /* ... */ },
})
```

### Custom Pagination

Override pagination behavior:

```typescript
import { paginateItems } from '@/lib/archive'

const customPagination = paginateItems(items, {
  page: Number(params.page) || 1,
  itemsPerPage: 20, // Custom page size
})
```

---

## 📖 Complete Examples

### Example 1: Notes Archive (Minimal)

```typescript
// src/app/notes/page.tsx
import { ArchiveLayout } from '@/components/layouts/archive-layout'
import { getArchiveData } from '@/lib/archive'
import { createArchivePageMetadata } from '@/lib/metadata'
import { notes } from '@/data/notes'

export const metadata = createArchivePageMetadata({
  title: 'Notes',
  description: 'Quick thoughts and snippets',
  path: '/notes',
  itemCount: notes.length,
})

export default async function NotesPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const { items } = getArchiveData({
    items: notes,
    searchParams: params,
    config: {
      searchFields: ['title', 'content'],
      defaultSort: 'newest',
    },
  })

  return (
    <ArchiveLayout title="Notes" description="Quick thoughts and snippets" itemCount={items.length}>
      <ul>
        {items.map(note => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </ArchiveLayout>
  )
}
```

### Example 2: Portfolio with Filtering

```typescript
// src/app/portfolio/page.tsx
import { ArchiveLayout } from '@/components/layouts/archive-layout'
import { ArchiveFilters } from '@/components/layouts/archive-filters'
import { getArchiveData } from '@/lib/archive'
import { createArchivePageMetadata, createCollectionSchema, getJsonLdScriptProps } from '@/lib/metadata'
import { getNonce } from '@/lib/csp'
import { portfolioItems } from '@/data/portfolio'

export const metadata = createArchivePageMetadata({
  title: 'Portfolio',
  description: 'Selected design and development work',
  path: '/portfolio',
  itemCount: portfolioItems.length,
})

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  const nonce = getNonce()
  
  const { items, filters } = getArchiveData({
    items: portfolioItems,
    searchParams: params,
    config: {
      searchFields: ['title', 'description', 'tags'],
      sortOptions: {
        newest: { field: 'year', order: 'desc' },
        oldest: { field: 'year', order: 'asc' },
      },
      defaultSort: 'newest',
    },
  })

  const jsonLd = createCollectionSchema({
    name: 'Portfolio',
    description: 'Selected design and development work',
    url: 'https://yourdomain.com/portfolio',
    items: items.map(item => ({
      name: item.title,
      description: item.description,
      url: `https://yourdomain.com/portfolio/${item.slug}`,
    })),
  })

  return (
    <>
      <script {...getJsonLdScriptProps(jsonLd, nonce)} />
      
      <ArchiveLayout
        title="Portfolio"
        description="Selected design and development work"
        itemCount={items.length}
        filters={
          <ArchiveFilters
            currentQuery={filters.query}
            selectedTags={filters.tags}
            availableTags={filters.availableTags}
            basePath="/portfolio"
          />
        }
      >
        <div className="grid gap-8 md:grid-cols-2">
          {items.map(item => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>
      </ArchiveLayout>
    </>
  )
}
```

### Example 3: Article with Hero Image

```typescript
// src/app/blog/[slug]/page.tsx (simplified)
import { ArticleLayout } from '@/components/layouts/article-layout'
import { getArticleData } from '@/lib/article'
import { createArticlePageMetadata } from '@/lib/metadata'
import { posts } from '@/data/posts'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  if (!post) return {}

  return createArticlePageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    authors: [post.author],
    tags: post.tags,
    heroImage: post.image ? {
      url: post.image,
      alt: post.imageAlt || post.title,
      width: 1200,
      height: 630,
    } : undefined,
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)!
  
  const articleData = getArticleData({
    item: post,
    allItems: posts,
    relatedFields: ['tags'],
    idField: 'slug',
    dateField: 'publishedAt',
  })

  return (
    <ArticleLayout>
      {post.image && (
        <img src={post.image} alt={post.imageAlt || post.title} />
      )}
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </ArticleLayout>
  )
}
```

---

## 🔧 Troubleshooting

### TypeScript Errors

**Problem:** `Property 'field' does not exist on type 'T'`

**Solution:** Ensure your type has the fields you're accessing:

```typescript
type Article = {
  slug: string
  title: string
  publishedAt: string  // ← Required for dateField
  tags: string[]       // ← Required for tag filtering
}

getArchiveData<Article>({
  items: articles,
  // ...
  config: {
    // TypeScript knows 'publishedAt' exists
  },
})
```

### Date Type Mismatches

**Problem:** `Type 'string' is not assignable to type 'Date'`

**Solution:** Convert strings to Date objects in JSON-LD:

```typescript
// ❌ Wrong
datePublished: post.publishedAt  // string

// ✅ Correct
datePublished: new Date(post.publishedAt)
```

### CSP Nonce Not Working

**Problem:** Inline scripts blocked by CSP

**Solution:** Use `getJsonLdScriptProps()` helper:

```typescript
import { getNonce } from '@/lib/csp'
import { getJsonLdScriptProps } from '@/lib/metadata'

const nonce = getNonce()

// ❌ Wrong
<script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

// ✅ Correct
<script {...getJsonLdScriptProps(jsonLd, nonce)} />
```

### Filters Not Updating

**Problem:** Search/filter changes don't affect results

**Solution:** Ensure you're passing `searchParams` correctly:

```typescript
// ✅ Correct - await the promise
export default async function Page({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams
  
  const { items } = getArchiveData({
    items: allItems,
    searchParams: params,  // ← Pass awaited params
    // ...
  })
}
```

### Related Items Not Showing

**Problem:** `relatedItems` is always empty

**Solution:** Check your `relatedFields` match your data:

```typescript
type Article = {
  tags: string[]  // ← Field name
}

getArticleData({
  item: article,
  allItems: articles,
  relatedFields: ['tags'],  // ← Must match field name
  // ...
})
```

---

## 🎓 Best Practices

### 1. Start with Generic Patterns

Always start with the generic utilities and only customize when needed:

```typescript
// Start here
<ArchiveLayout>
  <ArchiveFilters />
</ArchiveLayout>

// Only if needed
<ArchiveLayout>
  <CustomFilters />  // Domain-specific features
</ArchiveLayout>
```

### 2. Type Safety First

Define proper TypeScript types for your data:

```typescript
// ✅ Good
type Post = {
  slug: string
  title: string
  publishedAt: string
  tags: string[]
}

const archiveData = getArchiveData<Post>({
  items: posts,
  // ... TypeScript provides IntelliSense
})

// ❌ Bad
const archiveData = getArchiveData({
  items: posts as any,
  // ... No type safety
})
```

### 3. Consistent Naming

Use consistent field names across your data:

```typescript
// ✅ Good - consistent
type Post = { publishedAt: string }
type Article = { publishedAt: string }
type Note = { publishedAt: string }

// ❌ Bad - inconsistent
type Post = { publishedAt: string }
type Article = { createdDate: string }
type Note = { date: string }
```

### 4. Preserve Features

Don't remove features just to fit generic patterns:

```typescript
// ✅ Good - kept custom features
<ArchiveLayout filters={<BlogFilters showReadingTime />}>

// ❌ Bad - removed useful features
<ArchiveLayout filters={<ArchiveFilters />}>  // Lost reading time filter
```

### 5. Document Custom Patterns

When you create custom patterns, document why:

```typescript
// Custom SoftwareSourceCode schema because projects need:
// - codeRepository field
// - programmingLanguage field
// - runtimePlatform field
const jsonLd = {
  '@type': 'SoftwareSourceCode',
  // ...
}
```

---

## 📚 Additional Resources

- **Architecture Overview:** `/docs/architecture/refactoring-complete.md`
- **Phase 1 Details:** `/docs/architecture/phase-1-complete.md`
- **Phase 2 Details:** `/docs/architecture/phase-2-complete.md`
- **Working Examples:**
  - Archive: `/src/app/blog/page.tsx`, `/src/app/projects/page.tsx`
  - Article: `/src/app/blog/[slug]/page.tsx`
- **Library Reference:**
  - Archive utilities: `/src/lib/archive.ts`
  - Article utilities: `/src/lib/article.ts`
  - Metadata helpers: `/src/lib/metadata.ts`

---

## 🚀 Quick Reference

### Archive Page Checklist

- [ ] Import `getArchiveData` and `ArchiveLayout`
- [ ] Import `createArchivePageMetadata`
- [ ] Define your item type with TypeScript
- [ ] Call `getArchiveData()` with config
- [ ] Generate metadata with `createArchivePageMetadata()`
- [ ] Optional: Add JSON-LD with `createCollectionSchema()`
- [ ] Render with `<ArchiveLayout>`
- [ ] Add filters and pagination if needed

### Article Page Checklist

- [ ] Import `getArticleData` and `ArticleLayout`
- [ ] Import `createArticlePageMetadata`
- [ ] Define `generateStaticParams()` for static generation
- [ ] Call `getArticleData()` for navigation/related items
- [ ] Generate metadata with `createArticlePageMetadata()`
- [ ] Optional: Add JSON-LD with `createArticleSchema()` and `createBreadcrumbSchema()`
- [ ] Render with `<ArticleLayout>`
- [ ] Add navigation and related items sections

---

**Questions or issues?** Check the troubleshooting section or review the working examples in `/src/app/blog/` and `/src/app/projects/`.
