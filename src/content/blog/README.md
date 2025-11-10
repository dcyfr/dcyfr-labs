# Blog Content

This directory contains individual blog posts as MDX files.

## Adding a New Blog Post

To add a new blog post:

1. Create a new `.mdx` file in this directory with a URL-friendly filename (e.g., `my-new-post.mdx`)
2. Add frontmatter at the top of the file with the required metadata:

```mdx
---
title: "Your Post Title"
summary: "A brief summary of your post"
publishedAt: "2025-10-01"
tags: ["Tag1", "Tag2", "Tag3"]
featured: true
---

Your blog post content goes here...
```

### Frontmatter Fields

- **title** (required): The title of your blog post
- **summary** (required): A brief description that appears in listings and metadata
- **publishedAt** (required): Publication date in YYYY-MM-DD format
- **tags** (required): Array of tags for categorization
- **featured** (optional): Set to `true` to feature this post on the homepage
- **updatedAt** (optional): Date the post was last updated (YYYY-MM-DD format)
- **sources** (optional): Array of source links with `label` and `href` properties

### Writing Content

Use standard Markdown syntax in the body of your post. The content supports:

- Headings (`## Heading 2`, `### Heading 3`, etc.)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links and images
- Bold text
- Blockquotes

The reading time is automatically calculated based on word count.

## File Naming

The filename (without the `.mdx` extension) becomes the URL slug. For example:
- `my-new-post.mdx` → `/blog/my-new-post`
- `shipping-a-nextjs-tiny-portfolio.mdx` → `/blog/shipping-a-nextjs-tiny-portfolio`

Use lowercase letters and hyphens to separate words.
