"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BlogSearchFormProps = {
  query: string;
  tag: string;
};

export function BlogSearchForm({ query, tag }: BlogSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(query);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(query);
  }, [query, tag]);

  const applySearch = useCallback(
    (next: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next) {
      params.set("q", next);
    } else {
      params.delete("q");
    }

    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }

    const target = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

    startTransition(() => {
      router.replace(target, { scroll: false });
    });
    },
    [pathname, router, searchParams, tag]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalized = value.trim();
      if (normalized === query.trim()) {
        return;
      }
      applySearch(normalized);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [value, query, applySearch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applySearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex w-full items-center gap-2" aria-live="polite">
        <Input
          type="search"
          name="q"
          placeholder="Search posts..."
          aria-label="Search blog posts"
          autoComplete="off"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full"
        />
        {tag && <input type="hidden" name="tag" value={tag} />}
        <Button type="submit" variant="secondary" disabled={isPending}>
          {isPending ? "Searching..." : "Search"}
        </Button>
      </div>
    </form>
  );
}
