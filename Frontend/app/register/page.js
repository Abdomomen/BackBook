"use client";
import RegisterBtn from "../../reusableComponent/registerBtn";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background p-4 transition-colors duration-500">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-lg relative">
        {/* Card Container */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-500/20 mx-auto mb-6">
              B
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Join Our Community
            </h1>
            <p className="text-foreground-muted font-medium text-sm sm:text-base">
              Create an account to start sharing your stories
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Row: Username & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground-muted mb-2.5 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-variant focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-foreground font-bold shadow-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground-muted mb-2.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-variant focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-foreground font-bold shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Row: Password & Avatar (Simplified) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground-muted mb-2.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 chars"
                  className="w-full px-5 py-3.5 rounded-2xl bg-background border border-border-variant focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-foreground font-bold shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start mb-2 ml-1">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-gray-500 dark:text-gray-400"
              >
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <RegisterBtn
              username={username}
              email={email}
              password={password}
            />
          </form>

          {/* Footer Interaction */}
          <div className="mt-10 text-center pt-8 border-t border-border-variant">
            <p className="text-foreground-muted font-medium text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 dark:text-primary-400 font-black hover:underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Branding Subtitle */}
        <p className="mt-6 text-center text-sm text-gray-400 dark:text-gray-600">
          Joining signifies acceptance of our privacy policy
        </p>
      </div>
    </div>
  );
}
