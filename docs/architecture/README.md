# Architecture Documentation

This directory contains comprehensive architectural plans and documentation for the cyberdrew.dev project.

---

## 📚 Current Documentation

### Refactoring Plans

#### [Blog & Archive Pages Refactor](./blog-refactor-plan.md)
**Status:** Planning Phase  
**Goal:** Simplify and standardize `/blog`, `/projects`, and future archive pages

**Key Improvements:**
- 50-67% code reduction across archive and article pages
- Universal patterns for list/grid pages (Archive Pattern)
- Universal patterns for individual items (Article Pattern)
- Type-safe, configurable architecture

**Expected Results:**
- `/blog/page.tsx`: 248 → ~80 lines (67% reduction)
- `/blog/[slug]/page.tsx`: 311 → ~120 lines (61% reduction)
- `/projects/page.tsx`: 121 → ~60 lines (50% reduction)

---

#### [Core Pages Refactor](./core-pages-refactor-plan.md)
**Status:** Planning Phase  
**Goal:** Simplify and standardize core pages (/, /about, /contact, /resume)

**Key Improvements:**
- 40-50% code reduction across core pages
- Consistent layout patterns (PageLayout, PageHero, PageSection)
- Centralized metadata generation
- Reusable section components

**Expected Results:**
- `/` (homepage): 255 → ~140 lines (45% reduction)
- `/about`: 255 → ~130 lines (49% reduction)
- `/contact`: 74 → ~50 lines (32% reduction)
- `/resume`: 129 → ~90 lines (30% reduction)

---

#### [Developer Dashboard & Tools Refactor](./dashboard-refactor-plan.md)
**Status:** Planning Phase  
**Goal:** Simplify and standardize developer dashboards and admin tools (/analytics)

**Key Improvements:**
- 40-52% code reduction in dashboards
- Reusable dashboard components (layouts, tables, filters, exports)
- Consistent security patterns for dev-only access
- Type-safe utilities for sorting, filtering, pagination

**Expected Results:**
- `/analytics` (AnalyticsClient): 1,250 → ~600 lines (52% reduction)
- Future dashboards: < 200 lines each (vs 500+ baseline)
- 60% reduction in duplication across admin tools

---

## 🎯 Architecture Principles

All refactoring plans follow these core principles:

### 1. Separation of Concerns
- **Pages are thin routing shells** - composition only, no business logic
- **Business logic lives in `src/lib/*`** - testable, reusable
- **UI patterns in `src/components/layouts/*`** - consistent, composable

### 2. Don't Repeat Yourself (DRY)
- **Shared patterns across similar pages** - archives, articles, core pages, dashboards
- **Centralized utilities** - metadata generation, filtering, pagination, exports
- **Reusable components** - layouts, sections, filters, tables

### 3. Type Safety
- **Generic TypeScript patterns** - `ArchiveConfig<T>`, `ArticleConfig<T>`, `DashboardProps<T>`
- **Type-safe configurations** - prevent errors at build time
- **Strongly typed helpers** - catch issues early

### 4. Consistency
- **Design tokens throughout** - `TYPOGRAPHY`, `SPACING`, `CONTAINER_WIDTHS`
- **Same patterns for same problems** - archives follow same structure, dashboards share components
- **Predictable conventions** - easy to understand and maintain

### 5. Simplicity
- **Declarative over imperative** - configuration over code
- **Fewer lines, clearer intent** - readable, maintainable
- **Composable components** - mix and match as needed

---

## 📐 Key Patterns

### Archive Pattern
**For:** List/grid pages with filtering, sorting, pagination  
**Used by:** `/blog`, `/projects`, future `/writing`, `/notes`, `/bookmarks`

**Components:**
- `ArchiveLayout` - Universal wrapper
- `ArchiveFilters` - Search, tags, dropdowns
- `ArchivePagination` - Navigation

**Utilities:**
- `getArchiveData()` - Single data aggregation call
- `filterItems()`, `paginateItems()` - Reusable logic
- `createArchiveMetadata()` - Consistent metadata

---

### Article Pattern
**For:** Individual item pages with metadata, navigation, related content  
**Used by:** `/blog/[slug]`, `/projects/[slug]`, future individual pages

**Components:**
- `ArticleLayout` - Universal wrapper
- `ArticleHeader` - Title, date, tags, badges
- `ArticleFooter` - Share, sources, related items

**Utilities:**
- `getArticleData()` - Single data aggregation call
- `createArticleMetadata()` - Consistent metadata
- `getRelatedItems()` - Generic algorithm

---

### Page Pattern
**For:** Core pages with consistent structure  
**Used by:** `/`, `/about`, `/contact`, `/resume`

**Components:**
- `PageLayout` - Universal page wrapper
- `PageHero` - Standardized hero sections
- `PageSection` - Consistent section wrapper

**Utilities:**
- `createPageMetadata()` - Unified metadata generation
- Design tokens - `TYPOGRAPHY`, `SPACING`, etc.

---

### Dashboard Pattern
**For:** Developer tools with data tables, filters, exports, analytics  
**Used by:** `/analytics`, future admin dashboards, monitoring tools

**Components:**
- `DashboardLayout` - Universal dashboard wrapper
- `DashboardStats` - Stats cards grid
- `DashboardTable` - Sortable, filterable data tables
- `DashboardFilters` - Search, tags, date ranges
- `DashboardExport` - CSV/JSON export UI

**Utilities:**
- `sortData()`, `filterData()`, `paginateData()` - Table operations
- `exportToCSV()`, `exportToJSON()` - Export logic
- `assertDevOr404()` - Security protection
- Custom hooks: `useDashboardFilters()`, `useDashboardSort()`, `useDashboardExport()`

---

## 🚀 Implementation Status

### Phase 1: Foundation (Not Started)
- [ ] Create archive/article/page/dashboard libraries
- [ ] Create layout components for all patterns
- [ ] Write comprehensive tests
- [ ] Document patterns

### Phase 2: Blog & Archive Refactor (Not Started)
- [ ] Refactor blog list page
- [ ] Refactor blog post page
- [ ] Refactor projects page
- [ ] Verify all features work

### Phase 3: Core Pages Refactor (Not Started)
- [ ] Refactor homepage
- [ ] Refactor about page
- [ ] Refactor contact page
- [ ] Refactor resume page

### Phase 4: Dashboard Refactor (Not Started)
- [ ] Create dashboard foundation components
- [ ] Refactor analytics dashboard
- [ ] Create dashboard templates
- [ ] Document dashboard patterns

### Phase 5: Cleanup (Not Started)
- [ ] Remove deprecated code
- [ ] Finalize documentation
- [ ] Full regression testing

---

## 📊 Expected Impact

### Code Quality
- **Overall reduction:** 40-67% fewer lines across all page types
- **Improved testability:** Business logic separated from UI
- **Better maintainability:** Clear patterns, consistent structure
- **Type safety:** Generic patterns prevent errors

### Developer Experience
- **Faster development:** Reusable patterns save time (60% reduction for new dashboards)
- **Easy onboarding:** Clear conventions, good documentation
- **Fewer bugs:** Type-safe configs catch issues early
- **Easier testing:** Separated concerns, focused units

### User Experience
- **Zero breaking changes:** All features preserved
- **Consistent design:** Unified patterns across all pages
- **Better performance:** Optimized, smaller components
- **Improved accessibility:** Centralized a11y patterns
- **Better performance:** Simpler components
- **Consistent UX:** Same patterns across similar pages
- **Improved accessibility:** Standardized structure

---

## 📖 Related Documentation

- **Design System:** `/src/lib/design-tokens.ts`
- **Blog Architecture:** `/docs/blog/architecture.md`
- **Component Docs:** `/docs/components/`
- **API Documentation:** `/docs/api/`

---

**Last Updated:** November 10, 2025
