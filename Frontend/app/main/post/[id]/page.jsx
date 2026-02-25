"use client";
import { useEffect, useState } from "react";
import { useToken } from "../../../../context.jsx";
import { useRouter, useParams } from "next/navigation";
import { useSettings } from "../../../../SettingsContext";
import CommentsSection from "../../../../reusableComponent/CommentsSection";
import toast from "react-hot-toast";

export default function PostPage() {
  const { id } = useParams();
  const { token } = useToken();
  const router = useRouter();
  const { t } = useSettings();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/posts/single/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
          setLikesCount(data.post.likes?.length || 0);

          // Check if current user liked
          const meRes = await fetch("http://localhost:3000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            setIsLiked(data.post.likes?.includes(meData.user._id) || false);
          }
        } else {
          toast.error(t.postNotFound || "Post not found");
          router.push("/main");
        }
      } catch (err) {
        console.error(err);
        toast.error(t.errorLoadingPost || "Error loading post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token, router]);

  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden transition-all duration-300">
      {/* Image Section */}
      <div className="w-full lg:flex-1 relative flex items-center justify-center bg-zinc-950 px-4 py-12 lg:py-0 min-h-[50vh] lg:min-h-0">
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/10"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-12">
          {post.images?.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:3000/postImages/${img}`}
              alt={`Content ${idx}`}
              className="max-w-full lg:max-w-[90%] max-h-[80vh] rounded-2xl shadow-2xl object-contain ring-1 ring-white/10"
            />
          ))}
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full lg:w-[450px] bg-surface flex flex-col lg:h-full border-l border-border-variant shadow-2xl overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
        {/* Author Header */}
        <div className="p-6 border-b border-border-variant">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 font-black text-xl border border-primary-100 dark:border-primary-900/50 overflow-hidden">
              {post.author?.avatar ? (
                <img
                  src={
                    post.author.avatar.startsWith("http")
                      ? post.author.avatar
                      : `http://localhost:3000/userImages/${post.author.avatar}`
                  }
                  className="w-full h-full object-cover"
                  alt={post.author?.username}
                />
              ) : (
                post.author?.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-black text-foreground text-lg leading-tight">
                {post.author?.username}
              </h3>
              <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest mt-1">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6 space-y-4 border-b border-border-variant">
          {post.title && (
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {post.title}
            </h2>
          )}
          <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed whitespace-pre-wrap font-medium">
            {post.content}
          </p>

          {/* Like & Comment Stats */}
          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${
                isLiked
                  ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600"
                  : "hover:bg-rose-50 dark:hover:bg-rose-950/20 text-foreground-muted hover:text-rose-600"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
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
              {likesCount > 0 ? likesCount : ""} {t.love || "Like"}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection postId={id} />
      </div>
    </div>
  );
}
