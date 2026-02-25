"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function CommentsSection({ postId }) {
  const { token, user } = useToken();
  const { t } = useSettings();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    // Fetch comments
    fetchComments();
  }, [token, postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: body.trim(), post: postId }),
      });
      if (res.ok) {
        setBody("");
        fetchComments(); // refresh
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="animate-pulse flex gap-3">
                <div className="w-8 h-8 bg-background rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-background rounded w-1/4"></div>
                  <div className="h-4 bg-background rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-foreground-muted text-sm font-medium">
              {t.noComments || "No comments yet. Be the first!"}
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 group">
              <Link
                href={
                  comment.author?._id === user?._id
                    ? "/main/profile"
                    : `/main/profile/${comment.author?._id}`
                }
                className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs shrink-0 hover:scale-110 transition-transform"
              >
                {comment.author?.avatar ? (
                  <img
                    src={
                      comment.author.avatar.startsWith("http")
                        ? comment.author.avatar
                        : `http://localhost:3000/userImages/${comment.author.avatar}`
                    }
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  comment.author?.username?.charAt(0).toUpperCase()
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="bg-background rounded-2xl px-4 py-3">
                  <Link
                    href={
                      comment.author._id === user?._id
                        ? "/main/profile"
                        : `/main/profile/${comment.author._id}`
                    }
                    className="font-bold text-foreground text-xs hover:text-primary-600 transition-colors"
                  >
                    {comment.author?.username}
                  </Link>
                  <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">
                    {comment.body}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1 ml-2">
                  <span className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {user?._id === comment.author?._id && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-black uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {t.delete || "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-background/50 border-t border-border-variant"
      >
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t.writeComment || "Write a comment..."}
            className="flex-1 bg-surface border border-border-variant rounded-xl px-4 py-2.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t.send || "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
