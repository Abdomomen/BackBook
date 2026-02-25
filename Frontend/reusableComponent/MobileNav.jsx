"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "../SettingsContext";
import NotificationBell from "./NotificationBell";

export default function MobileNav({ user }) {
  const pathname = usePathname();
  const { t } = useSettings();

  if (!t) return null;

  const navItems = [
    {
      id: "Home",
      href: "/main",
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "Search",
      href: "/main/search",
      icon: (
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      id: "Notifications",
      component: <NotificationBell isMobileNav />,
    },
    {
      id: "Profile",
      href: "/main/profile",
      icon: user?.avatar ? (
        <img
          src={
            user.avatar.startsWith("http")
              ? user.avatar
              : `http://localhost:3000/userImages/${user.avatar}`
          }
          className="w-7 h-7 rounded-full object-cover border-2 border-primary-500"
          alt=""
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px] font-black border-2 border-primary-500">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      ),
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-surface/80 backdrop-blur-2xl border-t border-border-variant pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) =>
          item.href ? (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all ${
                pathname === item.href
                  ? "text-primary-600 scale-110"
                  : "text-foreground-muted active:scale-90"
              }`}
            >
              {item.icon}
            </Link>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-center w-16 h-12"
            >
              {item.component}
            </div>
          ),
        )}
      </div>
    </nav>
  );
}
