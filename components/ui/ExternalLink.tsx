import React from "react";
import Link from "next/link";
import { Arrow } from "./Arrow";

export function ExternalLink({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="inline-block mr-2">
      <span className="flex items-center justify-center gap-1 my-2 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 cursor-pointer">
        <Arrow size={20} />
        <span>{text}</span>
      </span>
    </Link>
  );
}
