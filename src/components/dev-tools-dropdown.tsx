"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function DevToolsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        title="Developer tools"
      >
        <Wrench className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card p-2 shadow-lg z-50">
          <nav className="flex flex-col">
            <Link
              href="/analytics"
              className="px-3 py-2 text-sm hover:bg-muted rounded"
              onClick={() => setOpen(false)}
              prefetch={false}
            >
              Analytics Dashboard
            </Link>
            {/* Placeholder for more dev links in future */}
          </nav>
        </div>
      )}
    </div>
  );
}
