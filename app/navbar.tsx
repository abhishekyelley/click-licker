"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UrlObject } from "url";

function NavItem({
  href,
  label,
}: {
  href: string | UrlObject;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <li>
      <Button variant={isActive ? "outline" : "ghost"} asChild>
        <Link href={href}>{label}</Link>
      </Button>
    </li>
  );
}

export function Navbar() {
  return (
    <header>
      <nav className="p-4 border-b">
        <ul className="flex space-x-4">
          <NavItem href="/" label={"Home"} />
          <NavItem href="/invite" label={"Invite"} />
        </ul>
      </nav>
    </header>
  );
}
