"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { LogOut } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Applications" },
  { href: "/affiliates", label: "Affiliates" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="border-b border-ink/10">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="font-medium text-ink tracking-tight"
          >
            Admin Console
          </Link>
          {user && (
            <nav className="flex items-center gap-5 text-sm">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    pathname?.startsWith(link.href)
                      ? "text-brand-700 font-medium"
                      : "text-ink/60 hover:text-ink"
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-5 text-sm text-ink/70">
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-ink/70 hover:text-ink"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
