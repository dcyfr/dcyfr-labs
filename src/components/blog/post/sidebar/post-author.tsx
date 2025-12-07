"use client";

import Image from "next/image";
import { teamMembers } from "@/data/team";
import Link from "next/link";

interface PostAuthorProps {
  authors: string[];
  publishedAt?: Date;
}

/**
 * Post Author Section
 * 
 * Displays author information with stacked avatars for multiple authors.
 * Similar to GitHub's commit author display.
 * Uses team member data from @/data/team.ts, with GitHub avatar fallback.
 * Links to /about page.
 * Shows the published date below the author info.
 */
export function PostAuthor({ authors, publishedAt }: PostAuthorProps) {
  // Filter to only valid team members
  const validAuthors = authors
    .map((authorId) => teamMembers.find((member) => member.id === authorId))
    .filter((author): author is NonNullable<typeof author> => author !== undefined);

  // Fallback for no valid authors
  if (validAuthors.length === 0) {
    return null;
  }

  // Single author - traditional layout
  if (validAuthors.length === 1) {
    const author = validAuthors[0];
    // Use avatarImagePath if provided, otherwise fallback to GitHub avatar
    const avatarUrl = author.avatarImagePath || `https://github.com/${author.id}.png`;

    return (
      <div className="pb-6 border-b">
        <h2 className="font-semibold mb-3 text-sm">Written By</h2>

        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 right-0 mb-3 ring-2 ring-background hover:ring-primary/30 transition-all">
          <Image
            src={avatarUrl}
            alt={`${author.name}'s avatar`}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <Link
          href={author.profileUrl}
          className="flex flex-col items-start gap-3 group hover:opacity-80 transition-opacity"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm leading-tight group-hover:underline">
              {author.name}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
              {author.title}
            </div>
          </div>
        </Link>

        {publishedAt && (
          <div className="text-xs text-muted-foreground mt-2 leading-tight">
            Published{" "}
            {publishedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        )}
      </div>
    );
  }

  // Multiple authors - stacked avatars like GitHub
  return (
    <div className="pb-6 border-b">
      <h2 className="font-semibold mb-3 text-sm">Written By</h2>

      {/* Stacked avatars */}
      <div className="flex items-center -space-x-2 mb-3">
        {validAuthors.map((author, index) => {
          // Use avatarImagePath if provided, otherwise fallback to GitHub avatar
          const avatarUrl =
            author.avatarImagePath || `https://github.com/${author.id}.png`;
          return (
            <Link
              key={author.id}
              href={author.profileUrl}
              className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-background hover:ring-primary/30 transition-all"
              style={{ zIndex: validAuthors.length - index }}
              title={author.name}
            >
              <Image
                src={avatarUrl}
                alt={`${author.name}'s avatar`}
                fill
                className="object-cover"
                sizes="40px"
              />
            </Link>
          );
        })}
      </div>

      {/* Author names and titles */}
      <div className="space-y-2">
        {validAuthors.map((author) => (
          <Link
            key={author.id}
            href={author.profileUrl}
            className="flex flex-col group hover:opacity-80 transition-opacity"
          >
            <div className="font-semibold text-sm leading-tight group-hover:underline">
              {author.name}
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              {author.title}
            </div>
          </Link>
        ))}
      </div>

      {publishedAt && (
        <div className="text-xs text-muted-foreground mt-3 leading-tight">
          Published{" "}
          {publishedAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
