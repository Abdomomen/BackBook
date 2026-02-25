"use client";
import React, { useState, useEffect } from "react";
import { useToken } from "../context";
import { useSettings } from "../SettingsContext";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SuggestedFriends() {
  const { token } = useToken();
  const { t } = useSettings();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/users/suggested", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [token]);

  const handleAddFriend = async (friendId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/friends/${friendId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.ok) {
        toast.success(t.requestSent || "Friend request sent!");
        // Update local state to show "Request Sent" or remove from list
        setUsers(users.filter((u) => u._id !== friendId));
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to send request");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  if (!t) return null;

  return (
    <div className="bg-surface rounded-[2.5rem] p-6 border border-border-variant shadow-sm hover:shadow-md transition-all">
      <h3 className="font-black mb-6 flex items-center justify-between text-foreground">
        {t.suggestedFriends}
        <span className="text-[10px] bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-3 py-1 rounded-full font-black uppercase tracking-widest">
          {t.discover}
        </span>
      </h3>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background" />
                <div className="space-y-1.5">
                  <div className="w-20 h-3 bg-background rounded" />
                  <div className="w-16 h-2 bg-background/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-zinc-500 text-xs font-medium text-center py-4">
          No suggestions at the moment.
        </p>
      ) : (
        <div className="space-y-5">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`/main/profile/${user._id}`}
                  className="relative flex-shrink-0"
                >
                  <div className="w-10 h-10 rounded-full bg-background border border-border-variant overflow-hidden group-hover:ring-2 ring-primary-500 transition-all">
                    {user.avatar ? (
                      <img
                        src={
                          user.avatar.startsWith("http")
                            ? user.avatar
                            : `http://localhost:3000/userImages/${user.avatar}`
                        }
                        alt={user.username}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-600 font-black text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="min-w-0">
                  <Link href={`/main/profile/${user._id}`}>
                    <p className="text-sm font-black text-foreground leading-tight truncate hover:text-primary-600 transition-colors">
                      {user.username}
                    </p>
                  </Link>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest truncate">
                    {user.reason || t.peopleYouMayKnow}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddFriend(user._id)}
                className="flex-shrink-0 text-[10px] font-black text-primary-600 hover:text-white transition-all px-4 py-2 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-600 rounded-xl border border-primary-100 dark:border-primary-900/50 uppercase tracking-widest"
              >
                {t.addFriend || "Add"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
