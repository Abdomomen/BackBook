"use client";
import FriendsReq from "../../../../reusableComponent/friendsReq";
import Sidebar from "../../../../reusableComponent/Sidebar";
import { useSettings } from "../../../../SettingsContext";
import { useToken } from "../../../../context";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FriendRequestsPage() {
  const { t } = useSettings();
  const { token } = useToken();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [token]);

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
            <div className="flex items-center gap-2">
              <Link
                href="/main/friends"
                className="p-2 hover:bg-background/80 rounded-full transition-colors group"
              >
                <svg
                  className="w-5 h-5 text-foreground-muted group-hover:text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-foreground">
                {t.requests}
              </h1>
            </div>
          </div>
        </header>

        <div className="py-8">
          <div className="max-w-3xl mx-auto px-6 mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {t.requests}
              </h2>
              <p className="text-foreground-muted text-sm mt-1">
                {t.manageConnections}
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6">
            <FriendsReq />
          </div>
        </div>
      </main>
    </div>
  );
}
