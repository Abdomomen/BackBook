"use client";
import Friends from "../../../reusableComponent/friendProv";
import Sidebar from "../../../reusableComponent/Sidebar";
import { useSettings } from "../../../SettingsContext";
import { useToken } from "../../../context";
import { useEffect, useState } from "react";
import Link from "next/link";
import MobileNav from "../../../reusableComponent/MobileNav";
import NotificationBell from "../../../reusableComponent/NotificationBell";

export default function FriendsPage() {
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

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-variant px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-background text-foreground-muted rounded-2xl border border-border-variant active:scale-90 transition-all shadow-sm"
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
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                B
              </div>
              <h1 className="text-lg font-black tracking-tight text-foreground">
                BackBook
              </h1>
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
            <Link
              href="/main/friends/findFriends"
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 text-sm"
            >
              {t.addFriend}
            </Link>
          </div>
        </header>

        <div className="py-8">
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground">
                  {t.yourFriends}
                </h2>
                <p className="text-foreground-muted text-sm mt-1">
                  {t.manageConnections}
                </p>
              </div>
              <div className="flex bg-background p-1 rounded-xl w-fit border border-border-variant">
                <button className="px-4 py-1.5 bg-surface rounded-lg text-xs font-bold shadow-sm text-foreground">
                  {t.allFriends}
                </button>
                <Link
                  href="/main/friends/friendsRequests"
                  className="px-4 py-1.5 text-foreground-muted text-xs font-bold hover:text-foreground transition-colors"
                >
                  {t.requests}
                </Link>
                <Link
                  href="/main/friends/findFriends"
                  className="px-4 py-1.5 text-foreground-muted text-xs font-bold hover:text-foreground transition-colors"
                >
                  {t.discover}
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6">
            <Friends />
          </div>
        </div>
      </main>
      <MobileNav user={user} />
    </div>
  );
}
