"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useState, useEffect } from "react";

export default function EditPost({ post, isOpen, onClose, onUpdate }) {
  const { token } = useToken();
  const { t } = useSettings();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
    }
  }, [post]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const res = await fetch(`http://localhost:3000/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUpdate(data.updatedPost);
        onClose();
      }
    } catch (error) {
      console.error("Error editing post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-surface w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-border-variant overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-border-variant flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {t.editPost || "Edit Post"}
            </h2>
            <p className="text-foreground-muted font-bold uppercase tracking-widest text-[10px] mt-1">
              {t.refineThoughts || "Refine your thoughts"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all"
          >
            <svg
              className="w-5 h-5 text-foreground-muted"
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

        {/* Content - Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleEdit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">
                {t.postTitle || "Post Title"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.givePostTitle || "Give your post a title..."}
                className="w-full bg-background border border-border-variant rounded-2xl px-6 py-4 text-foreground font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">
                {t.content || "Content"}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t.whatsOnYourMind || "What's on your mind?"}
                rows="6"
                className="w-full bg-background border border-border-variant rounded-2xl px-6 py-4 text-foreground font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted ml-1">
                {t.updateImages || "Update Images"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewImages.map((src, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-2xl overflow-hidden border-2 border-primary-500/30 relative group"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">
                        {t.newImage || "New Image"}
                      </span>
                    </div>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-border-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-background transition-all group">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <svg
                    className="w-8 h-8 text-foreground-muted group-hover:text-primary-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted group-hover:text-primary-500 text-center px-2">
                    {t.addPhotos || "Add Photos"}
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border-variant flex gap-4">
          <button
            onClick={handleEdit}
            disabled={loading}
            className="flex-1 px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-600/20 active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              t.saveChanges || "Save Changes"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground font-black rounded-2xl transition-all active:scale-95 text-xs uppercase tracking-widest border border-border-variant"
          >
            {t.cancel || "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
