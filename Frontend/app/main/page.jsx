"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PostsProvider from "../../reusableComponent/postsProvider";
import { useToken } from "../../context";
import { useSettings } from "../../SettingsContext";
import Sidebar from "../../reusableComponent/Sidebar";
import SuggestedFriends from "../../reusableComponent/SuggestedFriends";
import NotificationBell from "../../reusableComponent/NotificationBell";
import MobileNav from "../../reusableComponent/MobileNav";

export default function MainPage() {
  const { token, user } = useToken();
  const { t, accent } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-all duration-300">
      {/* Sidebar */}
      <Sidebar
        user={user}
        t={t}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-variant px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Mobile Toggle & Logo */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-background text-foreground-variant rounded-2xl border border-border-variant active:scale-90 transition-all shadow-sm"
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
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-500/20">
                B
              </div>
              <h1 className="text-xl font-black tracking-tighter text-foreground">
                BackBook
              </h1>
            </div>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />
            <Link
              href="/main/search"
              className="p-2 text-foreground-variant hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
              href="/main/addPost"
              className="bg-primary-600 hover:bg-primary-700 text-white p-2.5 sm:px-5 sm:py-2 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2"
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
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">{t.createPost}</span>
            </Link>
          </div>
        </header>

        <div className="py-8 pb-32 lg:pb-8">
          <div className="max-w-2xl mx-auto px-4 mb-6">
            <h2 className="text-3xl font-black tracking-tight">{t.yourFeed}</h2>
            <p className="text-foreground-muted text-sm font-medium">
              {t.seeWhatFriendsAreUpTo}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <PostsProvider />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex flex-col w-80 border-l border-border-variant p-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <SuggestedFriends />
      </aside>

      {/* Mobile Bottom Nav */}
      <MobileNav user={user} />
    </div>
  );
}
