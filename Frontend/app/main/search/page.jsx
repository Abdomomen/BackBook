"use client";
import { useState, useEffect } from "react";
import { useToken } from "../../../context";
import { useSettings } from "../../../SettingsContext";
import Sidebar from "../../../reusableComponent/Sidebar";
import SuggestedFriends from "../../../reusableComponent/SuggestedFriends";
import NotificationBell from "../../../reusableComponent/NotificationBell";
import MobileNav from "../../../reusableComponent/MobileNav";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const { token, user } = useToken();
  const { t } = useSettings();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'posts'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeTab]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "users"
          ? `http://localhost:3000/api/users/search?username=${query}`
          : `http://localhost:3000/api/posts/search?q=${query}`;

      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setResults(activeTab === "users" ? data.users : data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-all duration-300">
      <Sidebar user={user} t={t} />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border-variant px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tighter text-foreground">
              {t.search || "Search"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search Input */}
          <div className="relative mb-10 group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600">
              <svg
                className="w-6 h-6 text-foreground-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                activeTab === "users"
                  ? t.searchUsersPlaceholder || "Search users..."
                  : t.searchPostsPlaceholder || "Search posts..."
              }
              className="w-full bg-surface border border-border-variant rounded-[2.5rem] pl-16 pr-8 py-6 text-xl font-black text-foreground focus:ring-[12px] focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all shadow-xl shadow-zinc-100 dark:shadow-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-surface p-1.5 rounded-2xl border border-border-variant w-fit mx-auto">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === "users"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "text-foreground-muted hover:bg-background"
              }`}
            >
              {t.users || "Users"}
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === "posts"
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                  : "text-foreground-muted hover:bg-background"
              }`}
            >
              {t.posts || "Posts"}
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20 bg-surface rounded-[3rem] border border-border-variant">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-foreground-muted font-bold tracking-tight">
                  {query
                    ? t.noResults || "No results found for your search"
                    : t.typeToSearch || "Start typing to search"}
                </p>
              </div>
            ) : (
              <div
                className={
                  activeTab === "users"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                    : "space-y-6"
                }
              >
                {activeTab === "users"
                  ? results.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => router.push(`/main/profile/${u._id}`)}
                        className="bg-surface p-5 rounded-[2rem] border border-border-variant hover:shadow-xl transition-all cursor-pointer flex items-center gap-4 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-primary-500 overflow-hidden ring-4 ring-primary-50 dark:ring-primary-900/10 transition-transform group-hover:scale-105">
                          {u.avatar ? (
                            <img
                              src={
                                u.avatar.startsWith("http")
                                  ? u.avatar
                                  : `http://localhost:3000/userImages/${u.avatar}`
                              }
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-foreground text-base group-hover:text-primary-600 transition-colors">
                            {u.username}
                          </p>
                          <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mt-0.5">
                            View Profile
                          </p>
                        </div>
                      </div>
                    ))
                  : results.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => router.push(`/main/post/${post._id}`)}
                        className="bg-surface rounded-[2rem] p-8 shadow-sm border border-border-variant hover:shadow-2xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 font-black border border-primary-100 dark:border-primary-900/50 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                            {post.author?.avatar ? (
                              <img
                                src={
                                  post.author.avatar.startsWith("http")
                                    ? post.author.avatar
                                    : `http://localhost:3000/userImages/${post.author.avatar}`
                                }
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-xl">
                                {post.author?.username?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-foreground text-base tracking-tight leading-tight">
                              {post.author?.username}
                            </p>
                            <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mt-1">
                              {new Date(post.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary-600 transition-colors tracking-tight leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-base text-foreground-muted line-clamp-2 leading-relaxed font-medium">
                          {post.content}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-primary-600 font-black text-xs uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                          Read More
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="hidden xl:flex flex-col w-80 border-l border-border-variant p-6 sticky top-0 h-screen overflow-y-auto custom-scrollbar">
        <SuggestedFriends />
      </aside>

      <MobileNav user={user} />
    </div>
  );
}
