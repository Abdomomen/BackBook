
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 mb-6 tracking-tight">
        BackBook
      </h1>
      <p className="max-w-xl text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        A premium social platform built for People. Connect, share, and
        Post your Ideas with elegance.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          href="/login"
          className="flex-1 bg-black dark:bg-white text-white dark:text-black font-bold py-4 px-8 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Get Started
        </Link>
        <Link
          href="/register"
          className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95 transition-all duration-200 border border-gray-200 dark:border-white/10"
        >
          Sign Up
        </Link>
      </div>

      {/* Social Proof Placeholder */}
      <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 w-full max-w-4xl flex flex-wrap justify-center gap-8 grayscale opacity-50">
        <span className="font-bold text-xl tracking-tighter italic">
          NEXT.JS
        </span>
        <span className="font-bold text-xl tracking-tighter">TAILWIND</span>
        <span className="font-bold text-xl tracking-tighter">MONGO.DB</span>
        <span className="font-bold text-xl tracking-tighter underline underline-offset-4 decoration-blue-500">
          EXPRESS
        </span>
      </div>
    </div>
  );
}
