import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostSource } from "@/data/posts";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");
const WORDS_PER_MINUTE = 225;

function calculateReadingTime(body: string): Post["readingTime"] {
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return {
    words,
    minutes,
    text: `${minutes} min read`,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title as string,
      summary: data.summary as string,
      publishedAt: data.publishedAt as string,
      updatedAt: data.updatedAt as string | undefined,
      tags: (data.tags as string[]) || [],
      featured: data.featured as boolean | undefined,
      archived: data.archived as boolean | undefined,
      draft: data.draft as boolean | undefined,
      body: content,
      sources: data.sources as PostSource[] | undefined,
      readingTime: calculateReadingTime(content),
    } satisfies Post;
  });

  // Filter out draft posts in production
  const filteredPosts = posts.filter((post) => {
    if (process.env.NODE_ENV === "production" && post.draft) {
      return false;
    }
    return true;
  });

  // Sort by publishedAt date, newest first
  return filteredPosts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const post: Post = {
    slug,
    title: data.title as string,
    summary: data.summary as string,
    publishedAt: data.publishedAt as string,
    updatedAt: data.updatedAt as string | undefined,
    tags: (data.tags as string[]) || [],
    featured: data.featured as boolean | undefined,
    archived: data.archived as boolean | undefined,
    draft: data.draft as boolean | undefined,
    body: content,
    sources: data.sources as PostSource[] | undefined,
    readingTime: calculateReadingTime(content),
  };

  // Don't return draft posts in production
  if (process.env.NODE_ENV === "production" && post.draft) {
    return undefined;
  }

  return post;
}
