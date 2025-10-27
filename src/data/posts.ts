import { getAllPosts } from "@/lib/blog";

export type PostSource = {
  label: string;
  href: string;
};

export type Post = {
  id: string; // stable permanent identifier (never changes, independent of slug)
  slug: string; // unique URL segment (active/current slug - can change)
  title: string;
  summary: string;
  publishedAt: string; // ISO string
  updatedAt?: string; // ISO string
  tags: string[];
  featured?: boolean;
  archived?: boolean; // posts that are no longer updated
  draft?: boolean; // only visible in development
  body: string; // MDX content
  sources?: PostSource[];
  previousSlugs?: string[]; // old slugs that should 301 redirect to current slug
  readingTime: {
    words: number;
    minutes: number;
    text: string;
  };
};

// Retrieve all posts from the file system
export const posts: Post[] = getAllPosts();

export const postsBySlug = Object.fromEntries(posts.map((post) => [post.slug, post])) as Record<string, Post>;

export const postTagCounts = posts.reduce<Record<string, number>>((acc, post) => {
  for (const tag of post.tags) {
    acc[tag] = (acc[tag] ?? 0) + 1;
  }
  return acc;
}, {});

export const allPostTags = Object.freeze(Object.keys(postTagCounts).sort());

export const featuredPosts = Object.freeze(posts.filter((post) => post.featured));
