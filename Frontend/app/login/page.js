"use client";
import LoginBtn from "../../reusableComponent/loginBtn";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background p-4 transition-colors duration-500">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative">
        {/* Card Container */}
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary-500/20 mx-auto mb-6">
              B
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
              Welcome Back
            </h1>
            <p className="text-foreground-muted font-medium text-sm sm:text-base">
              Enter your credentials to access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div>
              <label className="block text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground-muted mb-2.5 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full px-5 py-4 rounded-2xl bg-background border border-border-variant focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-foreground font-bold shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2.5 ml-1">
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-foreground-muted">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl bg-background border border-border-variant focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 text-foreground font-bold shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <LoginBtn email={email} password={password} />
          </form>

          {/* Footer Interaction */}
          <div className="mt-10 text-center pt-8 border-t border-border-variant">
            <p className="text-foreground-muted font-medium text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary-600 dark:text-primary-400 font-black hover:underline decoration-2 underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Branding Subtitle */}
        <p className="mt-6 text-center text-sm text-gray-400 dark:text-gray-600">
          Secure Login • BackBook v1.0
        </p>
      </div>
    </div>
  );
}
