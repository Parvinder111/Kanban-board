"use client";

import { useEffect } from "react";

interface DeleteModalProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ title, onClose, onConfirm }: DeleteModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm animate-slide-in rounded-2xl border p-6"
        style={{
          background: "#1a1827",
          borderColor: "#2e2b4a",
          boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "rgba(248,113,113,0.12)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2
          className="text-lg mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#e8e6f0" }}
        >
          Delete Card?
        </h2>
        <p className="text-sm mb-6" style={{ color: "#6b6890" }}>
          <span className="font-medium" style={{ color: "#a09cc0" }}>&ldquo;{title}&rdquo;</span> will be permanently deleted. This cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "#211f35", color: "#a09cc0", border: "1px solid #2e2b4a" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #f87171, #dc2626)", color: "#fff" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
