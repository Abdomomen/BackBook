"use client";
import AddPost from "../../../reusableComponent/addPost";
import { useRouter } from "next/navigation";
import { useSettings } from "../../../SettingsContext";

export default function AddPostPage() {
  const router = useRouter();
  const { t } = useSettings();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 lg:p-12 transition-all duration-300">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-foreground-muted hover:text-primary-600 font-black text-xs uppercase tracking-widest transition-all group"
          >
            <div className="w-10 h-10 border border-border-variant rounded-xl flex items-center justify-center group-hover:border-primary-500/50 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-all">
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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
            </div>
            {t.feed}
          </button>

          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">
              {t.liveEditor || "Live Editor"}
            </span>
          </div>
        </header>

        <div className="relative">
          {/* Decorative Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <AddPost onPostAdded={() => router.push("/main")} />
        </div>
      </div>
    </div>
  );
}
