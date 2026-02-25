"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NotificationBell({ isMobileNav = false }) {
  const { token } = useToken();
  const { t, language } = useSettings();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread count periodically
  useEffect(() => {
    if (!token) return;
    const fetchCount = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/notifications?limit=1",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3000/api/notifications?limit=15",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("http://localhost:3000/api/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking notifications read:", err);
    }
  };

  const getNotificationText = (n) => {
    switch (n.type) {
      case "like":
        return `${n.sender?.username} ${t.likedYourPost || "liked your post"}`;
      case "comment":
        return `${n.sender?.username} ${t.commentedOnPost || "commented on your post"}`;
      case "friend_request":
        return `${n.sender?.username} ${t.sentYouFriendRequest || "sent you a friend request"}`;
      default:
        return "";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-rose-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        );
      case "comment":
        return (
          <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-primary-500"
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
          </div>
        );
      case "friend_request":
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className={`relative p-2.5 rounded-xl transition-all ${
          isMobileNav
            ? "bg-transparent text-foreground-muted active:scale-90"
            : "bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-border-variant"
        }`}
      >
        <svg
          className="w-5 h-5 text-foreground-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className={`absolute bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse ${
              isMobileNav ? "top-1 right-1 w-4 h-4" : "-top-1 -right-1 w-5 h-5"
            }`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute w-80 sm:w-96 bg-surface border border-border-variant rounded-2xl shadow-2xl z-[100] overflow-hidden ${
            isMobileNav
              ? "bottom-full left-1/2 -translate-x-1/2 mb-4"
              : `${language === "ar" ? "left-0" : "right-0"} top-full mt-2`
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-border-variant flex items-center justify-between">
            <h3 className="font-black text-foreground text-sm">
              {t.notifications || "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-primary-600 font-black uppercase tracking-wider hover:underline"
              >
                {t.markAllRead || "Mark all read"}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-6 flex justify-center">
                <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-foreground-muted text-sm font-medium">
                  {t.noNotifications || "No notifications yet"}
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={`/main/profile/${n.sender?._id || ""}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start gap-3 p-4 hover:bg-background/50 transition-colors border-b border-border-variant/50 last:border-0 ${
                    !n.read ? "bg-primary-50/30 dark:bg-primary-950/10" : ""
                  }`}
                >
                  {getNotificationIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium leading-snug">
                      {getNotificationText(n)}
                    </p>
                    {n.post?.title && (
                      <p className="text-xs text-foreground-muted mt-0.5 truncate">
                        "{n.post.title}"
                      </p>
                    )}
                    <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-wider mt-1">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 shrink-0"></div>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
