"use client";
import { useToken } from "../context.jsx";
import { useSettings } from "../SettingsContext";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddPost({ onPostAdded }) {
  const { token } = useToken();
  const { t } = useSettings();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error(t.maxImages || "You can only upload up to 10 images");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error(
        t.titleAndContentRequired || "Please provide both a title and content",
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(t.postCreated || "Post created successfully!");
        setTitle("");
        setContent("");
        setImages([]);
        setPreviews([]);
        if (onPostAdded) onPostAdded(data.post);
        else router.push("/main");
      } else {
        toast.error(
          data.message || t.somethingWentWrong || "Something went wrong",
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(t.failedToConnect || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-[2.5rem] border border-border-variant shadow-2xl overflow-hidden transition-all duration-500">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {t.createPost}
            </h2>
            <p className="text-foreground-muted font-medium text-sm">
              {t.expressYourself || "Express yourself to the world"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground-muted group-focus-within:text-primary-500 mb-2 transition-colors">
              {t.headline || "Headline"}
            </label>
            <input
              type="text"
              placeholder={t.givePostTitle || "Give your post a title..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border-variant rounded-2xl px-5 py-4 text-foreground placeholder:text-foreground-muted focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all font-bold"
            />
          </div>

          <div className="group">
            <label className="block text-[10px] font-black uppercase tracking-widest text-foreground-muted group-focus-within:text-primary-500 mb-2 transition-colors">
              {t.story || "Story"}
            </label>
            <textarea
              placeholder={t.whatsHappening || "What's happening?"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="w-full bg-background border border-border-variant rounded-3xl px-5 py-4 text-foreground placeholder:text-foreground-muted focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none font-medium leading-relaxed"
            ></textarea>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-[1.5rem] overflow-hidden group/img border border-border-variant"
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-rose-500/90 hover:bg-rose-600 text-white w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-all duration-300 scale-75 group-hover/img:scale-100"
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
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border-variant">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 px-6 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-all border border-primary-100 dark:border-primary-900/50"
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t.addMedia || "Add Media"}
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary-600/20 flex items-center gap-3 ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t.publishing || "Publishing..."}
                </>
              ) : (
                <>
                  {t.publishPost || "Publish Post"}
                  <svg
                    className="w-5 h-5 translate-y-[-1px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
