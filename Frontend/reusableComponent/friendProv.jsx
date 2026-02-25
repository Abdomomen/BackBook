"use client";
import Link from "next/link";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useEffect, useState } from "react";

export default function Friends() {
  const { token } = useToken();
  const { t } = useSettings();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/friends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="bg-surface rounded-2xl p-4 shadow-sm border border-border-variant animate-pulse transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-background rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-background rounded w-1/2"></div>
                <div className="h-3 bg-background rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30">
        <p className="text-rose-600 dark:text-rose-400 font-medium">
          {t.failedToLoadFriends}
        </p>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-20 bg-surface rounded-3xl border-2 border-dashed border-border-variant">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-foreground-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-foreground">{t.noFriendsYet}</h3>
        <p className="text-foreground-muted text-sm mt-1">{t.startSearching}</p>
        <button className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
          <Link href="/main/friends/findFriends">{t.discover}</Link>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <div
          key={friend._id}
          className="bg-surface rounded-2xl p-4 shadow-sm border border-border-variant hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <Link
              href={`/main/profile/${friend._id}`}
              className="relative flex items-center gap-4 flex-1 min-w-0 group/link"
            >
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface shadow-sm group-hover/link:scale-110 transition-transform">
                  {friend.avatar ? (
                    <img
                      src={
                        friend.avatar.startsWith("http")
                          ? friend.avatar
                          : `http://localhost:3000/userImages/${friend.avatar}`
                      }
                      alt={friend.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                      {friend.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-surface rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate group-hover/link:text-primary-600 transition-colors">
                  {friend.username}
                </h3>
                <p className="text-xs text-foreground-muted truncate">
                  {friend.email || t.activeRecently}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-background text-foreground-muted rounded-xl hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/30 dark:hover:text-primary-400 transition-all">
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
              <button className="p-2 bg-background text-foreground-muted rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-all">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
