"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/types";

interface CardModalProps {
  mode: "create" | "edit";
  card?: Card;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

export default function CardModal({ mode, card, onClose, onSubmit }: CardModalProps) {
  const [title, setTitle] = useState(card?.title ?? "");
  const [description, setDescription] = useState(card?.description ?? "");
  const [error, setError] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required.");
      titleRef.current?.focus();
      return;
    }
    onSubmit(title, description);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-slide-in">
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "#1a1827",
            borderColor: "#2e2b4a",
            boxShadow: "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,106,247,0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl"
              style={{ fontFamily: "var(--font-display)", color: "#e8e6f0" }}
            >
              {mode === "create" ? "New Card" : "Edit Card"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10 text-white/40 hover:text-white/80"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-xs font-medium mb-2" style={{ color: "#7c6af7" }}>
              TITLE <span className="text-rose-400">*</span>
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Enter card title…"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: "#211f35",
                border: `1px solid ${error ? "#f87171" : "#2e2b4a"}`,
                color: "#e8e6f0",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#7c6af7"; }}
              onBlur={(e) => { e.target.style.borderColor = error ? "#f87171" : "#2e2b4a"; }}
            />
            {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-xs font-medium mb-2" style={{ color: "#7c6af7" }}>
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description…"
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
              style={{
                background: "#211f35",
                border: "1px solid #2e2b4a",
                color: "#e8e6f0",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#7c6af7"; }}
              onBlur={(e) => { e.target.style.borderColor = "#2e2b4a"; }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "#211f35",
                color: "#a09cc0",
                border: "1px solid #2e2b4a",
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#2a2840"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "#211f35"; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(135deg, #7c6af7, #5b4fd4)",
                color: "#fff",
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.9"; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
            >
              {mode === "create" ? "Create Card" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
