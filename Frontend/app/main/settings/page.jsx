"use client";

import { useSettings } from "../../../SettingsContext";
import { useToken } from "../../../context";
import { useEffect, useState } from "react";
import Sidebar from "../../../reusableComponent/Sidebar";

export default function SettingsPage() {
  const { token, user } = useToken();
  const {
    language,
    changeLanguage,
    theme,
    changeTheme,
    accent,
    changeAccent,
    t,
  } = useSettings();

  const accents = [
    { name: "Indigo", value: "indigo", bg: "bg-indigo-500" },
    { name: "Rose", value: "rose", bg: "bg-rose-500" },
    { name: "Amber", value: "amber", bg: "bg-amber-500" },
    { name: "Emerald", value: "emerald", bg: "bg-emerald-500" },
    { name: "Violet", value: "violet", bg: "bg-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-all duration-300">
      <Sidebar user={user} t={t} />

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black mb-8 text-foreground flex items-center gap-3">
            <svg
              className="w-8 h-8 text-primary-600 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {t.settings}
          </h1>

          <div className="space-y-6">
            {/* Language Section */}
            <section className="bg-surface rounded-3xl p-6 shadow-sm border border-border-variant transition-all hover:shadow-md">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-foreground">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
                {t.language}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${
                    language === "en"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600 shadow-sm"
                      : "border-border-variant hover:border-primary-200 text-zinc-500 hover:text-foreground"
                  }`}
                >
                  🇺🇸 {t.english}
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${
                    language === "ar"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600 shadow-sm"
                      : "border-border-variant hover:border-primary-200 text-zinc-500 hover:text-foreground"
                  }`}
                >
                  🇪🇬 {t.arabic}
                </button>
              </div>
            </section>

            {/* Theme Section */}
            <section className="bg-surface rounded-3xl p-6 shadow-sm border border-border-variant transition-all hover:shadow-md">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-foreground">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
                {t.theme}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => changeTheme("light")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${
                    theme === "light"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600 shadow-sm"
                      : "border-border-variant hover:border-primary-200 text-zinc-500 hover:text-foreground"
                  }`}
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
                      strokeWidth="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                  {t.light}
                </button>
                <button
                  onClick={() => changeTheme("dark")}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold ${
                    theme === "dark"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600 shadow-sm"
                      : "border-border-variant hover:border-primary-200 text-zinc-500 hover:text-foreground"
                  }`}
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
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  {t.dark}
                </button>
              </div>
            </section>

            {/* Accent Color Section */}
            <section className="bg-surface rounded-3xl p-6 shadow-sm border border-border-variant transition-all hover:shadow-md">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2 text-foreground">
                <span className="w-1.5 h-6 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"></span>
                {t.accentColor}
              </h2>
              <div className="flex flex-wrap gap-4">
                {accents.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => changeAccent(a.value)}
                    className={`relative w-12 h-12 rounded-full transition-all transform hover:scale-110 active:scale-95 ${a.bg} ${
                      accent === a.value
                        ? "ring-4 ring-offset-4 ring-primary-500 dark:ring-offset-zinc-900"
                        : ""
                    }`}
                    title={a.name}
                  >
                    {accent === a.value && (
                      <svg
                        className="w-6 h-6 text-white absolute inset-0 m-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary-200 dark:shadow-none hover:shadow-primary-300 transform active:scale-[0.98]">
              {t.saveChanges}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
