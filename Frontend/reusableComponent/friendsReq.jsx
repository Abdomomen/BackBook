"use client";
import { useToken } from "../context";
import { useSettings } from "../SettingsContext";
import { useState, useEffect } from "react";

export default function FriendsReq() {
  const { token } = useToken();
  const { t } = useSettings();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/friends-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const requestsList = data.friendsRequests || [];
        setRequests(requestsList);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError(t.failedToLoadFriends);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token, t.failedToLoadFriends]);

  const handleAction = async (msg, requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/friends-requests/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            method: msg,
          }),
        },
      );
      await response.json();
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (error) {
      console.error(`Error ${msg}ing request:`, error);
      setError(`Failed to ${msg} request`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 transition-colors">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl p-4 shadow-sm border border-border-variant animate-pulse flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-background rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-background rounded w-1/3"></div>
              <div className="h-3 bg-background rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-center text-rose-600 dark:text-rose-400 font-medium">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-16 bg-surface rounded-3xl border-2 border-dashed border-border-variant transition-colors">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
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
        <h3 className="text-lg font-bold text-foreground">
          {t.noPendingRequests}
        </h3>
        <p className="text-foreground-muted text-sm mt-1 px-4">
          {t.noFriendsYet}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 transition-colors">
      {requests.map((request) => (
        <div
          key={request._id}
          className="bg-surface rounded-2xl p-4 shadow-sm border border-border-variant hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-4 group"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl ring-4 ring-primary-50 dark:ring-primary-900/10">
              {request.avatar ? (
                <img
                  src={
                    request.avatar.startsWith("http")
                      ? request.avatar
                      : `http://localhost:3000/userImages/${request.avatar}`
                  }
                  alt={request.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                request.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-600 rounded-full border-2 border-surface flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h4 className="font-bold text-foreground group-hover:text-primary-600 transition-colors">
              {request.username}
            </h4>
            <p className="text-xs text-foreground-muted">{t.sentRequest}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleAction("accept", request._id)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-500/20 active:scale-95"
            >
              {t.confirm}
            </button>
            <button
              onClick={() => handleAction("decline", request._id)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground rounded-xl font-bold text-sm transition-all active:scale-95 border border-border-variant"
            >
              {t.delete}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
