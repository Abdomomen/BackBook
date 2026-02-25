"use client";
import Link from "next/link";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext.jsx";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeleteModal from "./deleteModal.jsx";
import EditPost from "./editPost.jsx";
import EditProfileModal from "./EditProfileModal.jsx";
import CommentsSection from "./CommentsSection";

export default function Profile() {
  const { token } = useToken();
  const { t } = useSettings();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
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
      if (!token) return;
      try {
        // Fetch user info
        const userRes = await fetch("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);

          // Fetch user posts after user is set to get _id
          const postsRes = await fetch(
            "http://localhost:3000/api/posts/userPosts",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          if (postsRes.ok) {
            const postsData = await postsRes.json();
            const currentUserId = userData.user._id;
            const postsWithLikes = (postsData.posts || []).map((p) => ({
              ...p,
              likesCount: p.likes?.length || 0,
              isLiked: p.likes?.includes(currentUserId) || false,
            }));
            setPosts(postsWithLikes);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${selectedPost._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== selectedPost._id));
        setIsDeleteOpen(false);
        setSelectedPost(null);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    );
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 pb-24">
      {/* Profile Header */}
      <div className="bg-surface rounded-[2.5rem] shadow-sm border border-border-variant p-6 sm:p-10 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] border-4 border-white dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-4 ring-primary-50 dark:ring-primary-900/10 group-hover:scale-105 transition-transform duration-500">
              {user?.avatar ? (
                <img
                  src={
                    user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:3000/userImages/${user.avatar}`
                  }
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-indigo-600 text-white font-black text-4xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-1">
                {user?.username}
              </h1>
              {user?.bio && (
                <p className="text-foreground-muted font-medium text-sm max-w-md mx-auto sm:mx-0 mb-2 italic">
                  "{user.bio}"
                </p>
              )}
              <p className="text-foreground-muted font-black uppercase tracking-widest text-[10px]">
                BackBook Member
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsProfileEditOpen(true)}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-900 text-foreground font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-wider border border-border-variant flex items-center justify-center gap-2"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Create Post Redirect Field */}
        <div className="bg-surface p-6 rounded-[2rem] shadow-sm border border-border-variant">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-background overflow-hidden border border-border-variant">
              {user?.avatar ? (
                <img
                  src={
                    user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:3000/userImages/${user.avatar}`
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <Link
              href="/main/addPost"
              className="flex-1 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-6 py-4 rounded-2xl text-zinc-500 dark:text-zinc-400 text-sm font-bold transition-all border border-zinc-100 dark:border-zinc-700/50"
            >
              What's on your mind, {user?.username?.split(" ")[0]}?
            </Link>
          </div>
        </div>

        {/* User Posts Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Your Activity
            </h2>
            <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              {posts.length} Posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="bg-surface p-16 rounded-[2.5rem] border border-border-variant text-center shadow-sm">
              <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-zinc-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 2v4a1 1 0 001 1h4"
                  />
                </svg>
              </div>
              <p className="text-zinc-500 font-bold mb-8">
                You haven't shared anything yet.
              </p>
              <Link
                href="/main/addPost"
                className="inline-flex px-10 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-95"
              >
                Create First Post
              </Link>
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
                          {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-foreground">
                            {user?.username}
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
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                            setIsEditOpen(true);
                          }}
                          className="p-2.5 bg-background hover:bg-primary-50 dark:hover:bg-primary-900/20 text-foreground-muted hover:text-primary-600 rounded-xl transition-all border border-border-variant hover:border-primary-200 shadow-sm"
                          title="Edit Post"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2.5 bg-background hover:bg-rose-50 dark:hover:bg-rose-950/20 text-foreground-muted hover:text-rose-600 rounded-xl transition-all border border-border-variant hover:border-rose-200 shadow-sm"
                          title="Delete Post"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
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
                        onClick={() => router.push(`/main/post/${post._id}`)}
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

                  {/* Removed internal CommentsSection to match Feed behavior (navigation) */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditPost
        isOpen={isEditOpen}
        post={selectedPost}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdatePost}
      />

      {isDeleteOpen && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeletePost}
        />
      )}

      {isProfileEditOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsProfileEditOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
