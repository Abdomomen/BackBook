"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostsProvider() {
  const { token, user } = useToken();
  const { t } = useSettings();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});

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
    const fetchPosts = async () => {
      if (!token || !user) return;
      try {
        const response = await fetch(
          "http://localhost:3000/api/posts/friends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const userId = user._id;
        const postsWithLikes = (data.posts || []).map((p) => ({
          ...p,
          likesCount: p.likes?.length || 0,
          isLiked: p.likes?.includes(userId) || false,
        }));
        setPosts(postsWithLikes);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token, user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto p-4 mt-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-surface rounded-[2rem] p-6 shadow-sm animate-pulse border border-border-variant"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-background rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-background rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-background rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-4 bg-background rounded w-full mb-2"></div>
            <div className="h-24 bg-background/50 rounded-[1.5rem]"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto p-4 pb-20 mt-4 transition-colors">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-surface rounded-[2.5rem] shadow-sm border border-border-variant overflow-hidden hover:shadow-xl transition-all duration-500"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <Link
              href={
                post.author?._id === user?._id
                  ? "/main/profile"
                  : `/main/profile/${post.author?._id}`
              }
              className="flex items-center gap-4 group/author"
            >
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-zinc-100 ring-4 ring-primary-50 dark:ring-primary-900/10 group-hover/author:scale-110 transition-transform duration-300">
                {post.author?.avatar ? (
                  <img
                    src={
                      post.author.avatar.startsWith("http")
                        ? post.author.avatar
                        : `http://localhost:3000/userImages/${post.author.avatar}`
                    }
                    alt={post.author.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white font-black text-lg">
                    {post.author?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-black text-foreground text-base leading-tight group-hover/author:text-primary-600 transition-colors">
                  {post.author?.username}
                </h3>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">
                  {new Date(post.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </Link>
          </div>

          <div
            className="cursor-pointer"
            onClick={() => router.push(`/main/post/${post._id}`)}
          >
            {/* Content */}
            <div className="px-6 pb-4">
              {post.title && (
                <h2 className="text-xl font-black text-foreground mb-2 tracking-tight">
                  {post.title}
                </h2>
              )}
              <div className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                {expandedPosts[post._id] || post.content.length <= 150 ? (
                  <p className="whitespace-pre-wrap">{post.content}</p>
                ) : (
                  <p>
                    {post.content.substring(0, 150)}...
                    <span className="text-primary-600 font-extrabold ml-1">
                      {t.readMore}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Images Grid */}
            {post.images && post.images.length > 0 && (
              <div className="px-6 pb-2">
                <div
                  className={`grid gap-2 rounded-[1.5rem] overflow-hidden ${
                    post.images.length === 1
                      ? "grid-cols-1"
                      : post.images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {post.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group overflow-hidden ${post.images.length === 1 ? "h-48" : "h-32"}`}
                    >
                      <img
                        src={`http://localhost:3000/postImages/${img}`}
                        alt="Post content"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 px-6 flex items-center justify-between mt-2 border-t border-border-variant">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post._id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                  post.isLiked
                    ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600"
                    : "hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-500 dark:text-zinc-400 hover:text-rose-600"
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
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/main/post/${post._id}`);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-950/20 text-zinc-500 dark:text-zinc-400 hover:text-primary-600 transition-all font-black text-[10px] uppercase tracking-widest"
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
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-all font-black text-[10px] uppercase tracking-widest">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              {t.share}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
