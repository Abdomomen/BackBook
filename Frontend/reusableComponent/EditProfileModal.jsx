"use client";
import { useState, useRef } from "react";
import { useToken } from "../context";
import { useSettings } from "../SettingsContext";
import toast from "react-hot-toast";

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const { token } = useToken();
  const { t } = useSettings();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await fetch("http://localhost:3000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(
          t.profileUpdateSuccess || "Profile updated successfully!",
        );
        onUpdate(data.user);
        onClose();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-md rounded-[2.5rem] shadow-2xl border border-border-variant overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {t.editProfile || "Edit Profile"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-full transition-colors text-foreground-variant"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative group cursor-pointer"
              >
                <div className="w-24 h-24 rounded-[2rem] bg-background border-4 border-border-variant overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : user?.avatar ? (
                    <img
                      src={
                        user.avatar.startsWith("http")
                          ? user.avatar
                          : `http://localhost:3000/userImages/${user.avatar}`
                      }
                      className="w-full h-full object-cover"
                      alt={user.username}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white font-black text-2xl">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-foreground-muted">
                {t.changePhoto || "Change Photo"}
              </p>
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-2 ml-1">
                {t.usernameLabel || "Username"}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-background border border-border-variant rounded-2xl px-5 py-3.5 font-bold text-foreground focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Bio Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-2 ml-1">
                {t.bioLabel || "Bio"}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows="3"
                className="w-full bg-background border border-border-variant rounded-2xl px-5 py-3.5 font-bold text-foreground focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm resize-none"
                placeholder={
                  t.bioPlaceholder || "Tell us something about yourself..."
                }
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl bg-background border border-border-variant text-foreground font-black text-xs uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
              >
                {t.cancel || "Cancel"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 rounded-2xl bg-primary-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  t.save || "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
