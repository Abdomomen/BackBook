"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommentsSection from "./CommentsSection";

export default function FriendProfile({ id }) {
  const { token, user } = useToken();
  const { t } = useSettings();
  const router = useRouter();
  const [friend, setFriend] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = async (postId) => {
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, likesCount: data.likesCount, isLiked: data.isLiked }
              : p,
          ),
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !id || !user) return;
      try {
        setLoading(true);
        // Fetch friend info
        const userRes = await fetch(
          `http://localhost:3000/api/users/profile/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          setFriend(userData.friend);
        } else if (userRes.status === 403) {
          // Not a friend or unauthorized
          setFriend({ error: "Unauthorized" });
        }

        // Fetch friend posts
        const postsRes = await fetch(`http://localhost:3000/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          const userId = user._id;
          const postsWithLikes = (postsData.posts || []).map((p) => ({
            ...p,
            likesCount: p.likes?.length || 0,
            isLiked: p.likes?.includes(userId) || false,
          }));
          setPosts(postsWithLikes);
        }
      } catch (err) {
        console.error("Error fetching friend data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, id, user]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-pulse mt-8">
        <div className="bg-surface rounded-[2rem] p-8 shadow-sm border border-border-variant flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-background"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-background rounded w-1/3"></div>
            <div className="h-4 bg-background rounded w-1/4"></div>
          </div>
        </div>
        <div className="h-32 bg-surface rounded-[2rem] border border-border-variant"></div>
      </div>
    );
  }

  if (friend?.error) {
    return (
      <div className="w-full max-w-2xl mx-auto py-20 text-center bg-surface rounded-[2.5rem] border border-border-variant shadow-sm mt-8">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-rose-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 15v2m0-8V7m0 0a2 2 0 100-4 2 2 0 000 4zm-7 13a6 6 0 0112 0v1H5v-1z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">
          Private Profile
        </h2>
        <p className="text-foreground-muted font-medium px-10">
          You must be friends with this user to view their full profile and
          posts.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 px-8 py-3 bg-primary-600 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 pb-24">
      {/* Profile Header */}
      <div className="bg-surface rounded-[2.5rem] shadow-sm border border-border-variant p-6 sm:p-10 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] border-4 border-white dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-4 ring-primary-50 dark:ring-primary-900/10 transition-transform duration-500">
              {friend?.avatar ? (
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-black text-4xl">
                  {friend?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-1">
                {friend?.username}
              </h1>
              {friend?.bio && (
                <p className="text-foreground-muted font-medium text-sm max-w-md mx-auto sm:mx-0 mb-2 italic">
                  "{friend.bio}"
                </p>
              )}
              <p className="text-foreground-muted font-black uppercase tracking-widest text-[10px]">
                BackBook Member
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                Friends
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider border border-border-variant flex items-center justify-center gap-2"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Friend Posts Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Shared Posts
            </h2>
            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {posts.length} Posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-surface p-16 rounded-[2.5rem] border border-border-variant text-center shadow-sm">
              <p className="text-zinc-500 font-bold">
                {friend?.username} hasn't shared anything yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-surface rounded-[2rem] border border-border-variant overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/10 flex items-center justify-center text-primary-600 font-black text-lg border border-primary-100 dark:border-primary-900/20">
                          {friend?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-foreground">
                            {friend?.username}
                          </h4>
                          <p className="text-[10px] text-foreground-muted font-black uppercase tracking-widest mt-0.5">
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
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() => router.push(`/main/post/${post._id}`)}
                    >
                      {post.title && (
                        <h3 className="text-xl font-black text-foreground mb-3 leading-snug tracking-tight">
                          {post.title}
                        </h3>
                      )}

                      <div className="text-foreground-muted text-sm font-medium leading-relaxed mb-6">
                        {expandedPosts[post._id] ||
                        post.content.length <= 150 ? (
                          <p className="whitespace-pre-wrap">{post.content}</p>
                        ) : (
                          <p>
                            {post.content.substring(0, 150)}...
                            <span className="text-primary-600 font-extrabold ml-1">
                              Read More
                            </span>
                          </p>
                        )}
                      </div>

                      {post.images && post.images.length > 0 && (
                        <div className="pb-2">
                          <div
                            className={`grid gap-2 rounded-3xl overflow-hidden ${
                              post.images.length === 1
                                ? "grid-cols-1"
                                : post.images.length === 2
                                  ? "grid-cols-2"
                                  : "grid-cols-2 sm:grid-cols-3"
                            }`}
                          >
                            {post.images.map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative group overflow-hidden ${post.images.length === 1 ? "max-h-[400px]" : "h-32 sm:h-48"}`}
                              >
                                <img
                                  src={`http://localhost:3000/postImages/${img}`}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  alt=""
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 py-4 bg-background/30 flex items-center justify-between border-t border-border-variant/50">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                          post.isLiked
                            ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600"
                            : "hover:bg-rose-50 dark:hover:bg-rose-950/20 text-foreground-muted hover:text-rose-600"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={post.isLiked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        {post.likesCount > 0 ? post.likesCount : ""} {t.love}
                      </button>
                      <button
                        onClick={() =>
                          setActiveCommentPost(
                            activeCommentPost === post._id ? null : post._id,
                          )
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                          activeCommentPost === post._id
                            ? "bg-primary-50 dark:bg-primary-950/20 text-primary-600"
                            : "hover:bg-primary-50 dark:hover:bg-primary-950/20 text-foreground-muted hover:text-primary-600"
                        }`}
                      >
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        {post.commentsCount || 0} {t.think}
                      </button>
                    </div>
                  </div>

                  {activeCommentPost === post._id && (
                    <div className="border-t border-border-variant bg-surface-variant flex flex-col max-h-[500px]">
                      <CommentsSection postId={post._id} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
