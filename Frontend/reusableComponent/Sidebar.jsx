"use client";

import Link from "next/link";
import { useSettings } from "../SettingsContext";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar({ user, t, isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  if (!t) return null;

  const menuItems = [
    {
      name: t.feed,
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      href: "/main",
      id: "Feed",
    },
    {
      name: t.friends,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      href: "/main/friends",
      id: "Friends",
    },
    {
      name: t.search || "Search",
      icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      href: "/main/search",
      id: "Search",
    },
    {
      name: t.settings,
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      href: "/main/settings",
      id: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-surface border-r border-border-variant p-6
          transition-transform duration-500 ease-in-out lg:translate-x-0 lg:static lg:block lg:h-screen lg:z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-foreground">
              BackBook
            </h1>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 rounded-xl border border-zinc-100 dark:border-zinc-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              prefetch={true}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group cursor-pointer ${
                pathname === item.href
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-100 dark:shadow-none font-bold scale-[1.02]"
                  : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${pathname === item.href ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20"}`}
              >
                <svg
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${pathname === item.href ? "text-white" : "group-hover:text-primary-600"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
              </div>
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <Link
          href="/main/profile"
          onClick={() => onClose?.()}
          className="mt-auto p-4 bg-background dark:bg-zinc-900/50 rounded-3xl border border-border-variant shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group block"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 ring-2 ring-primary-50 dark:ring-primary-900/20 group-hover:ring-primary-100 dark:group-hover:ring-primary-900/40 transition-all">
                {user?.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar
                        : `http://localhost:3000/userImages/${user.avatar}`
                    }
                    alt={user.username}
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition-transform group-hover:scale-110 duration-500">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">
                {t.loggedInAs}
              </p>
              <h4 className="text-sm font-black text-foreground truncate leading-tight group-hover:text-primary-600 transition-colors">
                {user ? user.username : t.loading}
              </h4>
            </div>
          </div>
        </Link>
      </aside>
    </>
  );
}
