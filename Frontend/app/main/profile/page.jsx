"use client";
import Profile from "../../../reusableComponent/profile";
import Sidebar from "../../../reusableComponent/Sidebar";
import { useSettings } from "../../../SettingsContext";
import { useToken } from "../../../context";
import { useEffect, useState } from "react";
import Link from "next/link";
import NotificationBell from "../../../reusableComponent/NotificationBell";

export default function ProfilePage() {
  const { t } = useSettings();
  const { token, user } = useToken();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-all duration-300">
      <Sidebar
        user={user}
        t={t}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-variant px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-background text-zinc-600 dark:text-zinc-400 rounded-2xl border border-border-variant active:scale-90 transition-all shadow-sm"
              aria-label="Open Sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <Link
                href="/main"
                className="p-2 hover:bg-background/80 rounded-full transition-colors group hidden sm:block"
              >
                <svg
                  className="w-6 h-6 text-zinc-500 group-hover:text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-black tracking-tight">{t.profile}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <Link
              href="/main/search"
              className="p-2 text-foreground-variant hover:text-primary-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
          </div>
        </header>

        <div>
          <Profile />
        </div>
      </main>
    </div>
  );
}
