"use client";
import { useToken } from "../context";
import { useSettings } from "../SettingsContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FindFriends() {
  const { token } = useToken();
  const { t } = useSettings();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendingRequest, setSendingRequest] = useState({});
  const [requestSent, setRequestSent] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const url = searchTerm
          ? `http://localhost:3000/api/users/search?username=${searchTerm}`
          : "http://localhost:3000/api/users/suggested";

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [token, searchTerm]);

  const addFriend = async (id) => {
    setSendingRequest((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`http://localhost:3000/api/users/friends/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setRequestSent((prev) => ({ ...prev, [id]: true }));
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    } finally {
      setSendingRequest((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse transition-colors">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-surface rounded-2xl p-6 border border-border-variant"
          >
            <div className="w-20 h-20 bg-background rounded-full mx-auto mb-4"></div>
            <div className="h-5 bg-background rounded w-2/3 mx-auto mb-3"></div>
            <div className="h-10 bg-background/50 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            {t.discoverPeople}
          </h1>
          <p className="text-foreground-muted font-medium">
            {t.findNewFriends}
          </p>
        </div>
        <div className="relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchUsers}
            className="bg-surface border border-border-variant rounded-xl px-10 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary-500 outline-none transition-all w-full md:w-64"
          />
          <svg
            className="w-5 h-5 text-foreground-muted absolute left-3 top-2.5"
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
      </div>

      {users.length === 0 ? (
        <div className="bg-surface p-12 rounded-3xl border border-border-variant text-center shadow-sm">
          <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-foreground-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {searchTerm ? t.noUsersFound : t.noMoreDiscover}
          </h3>
          <p className="text-foreground-muted max-w-xs mx-auto">
            {searchTerm ? t.noUsersFound : t.noMoreDiscover}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-surface rounded-3xl border border-border-variant p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-primary-50 dark:border-primary-900/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  {user.avatar ? (
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
                    <div className="w-full h-full flex items-center justify-center bg-background text-foreground-muted">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                {user.reason && (
                  <div className="absolute -top-2 -right-2 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-800 shadow-sm animate-bounce">
                    {user.reason}
                  </div>
                )}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 w-4 h-4 rounded-full border-2 border-surface"></div>
              </div>

              <div className="text-center mb-6">
                <Link
                  href={`/main/profile/${user._id}`}
                  className="text-lg font-black text-foreground hover:text-primary-600 transition-colors block truncate px-2"
                >
                  {user.username}
                </Link>
                <p className="text-xs text-foreground-muted font-bold uppercase tracking-widest mt-1">
                  {user.mutualCount
                    ? `${user.mutualCount} ${t.mutualFriends}`
                    : t.newToBackBook}
                </p>
              </div>

              <button
                onClick={() => addFriend(user._id)}
                disabled={sendingRequest[user._id] || requestSent[user._id]}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  requestSent[user._id]
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default border border-green-200 dark:border-green-800"
                    : sendingRequest[user._id]
                      ? "bg-background text-foreground-muted cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20"
                }`}
              >
                {sendingRequest[user._id] ? (
                  <svg
                    className="animate-spin h-5 w-5 text-foreground-muted"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : requestSent[user._id] ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t.requestSent}
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                    </svg>
                    {t.addFriend}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
