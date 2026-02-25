"use client";
import React from "react";
import { useSettings } from "../SettingsContext";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName = "post",
}) {
  const { t } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-border-variant overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 mb-6 mx-auto sm:mx-0">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-black text-foreground mb-3 text-center sm:text-left tracking-tight">
            {t.deleteConfirm || `Delete ${itemName}?`}
          </h3>
          <p className="text-foreground-muted text-sm font-medium leading-relaxed mb-8 text-center sm:text-left">
            {t.deleteWarning ||
              `This action cannot be undone. This ${itemName} will be permanently removed from your profile and the feed.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-red-500/20 active:scale-95 text-xs uppercase tracking-widest order-2 sm:order-1"
            >
              {t.yesDelete || "Yes, Delete"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground font-black rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest border border-border-variant order-1 sm:order-2"
            >
              {t.cancel || "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
