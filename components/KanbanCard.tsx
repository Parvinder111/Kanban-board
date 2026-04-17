"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType, Status, COLUMNS } from "@/types";
import CardModal from "./CardModal";
import DeleteModal from "./DeleteModal";

interface CardProps {
  card: CardType;
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Status) => void;
  isDragOverlay?: boolean;
}

const statusOrder: Status[] = ["pending", "in-progress", "completed"];

export default function KanbanCard({ card, onUpdate, onDelete, onMove, isDragOverlay }: CardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const colIndex = statusOrder.indexOf(card.status);
  const canMoveBack = colIndex > 0;
  const canMoveForward = colIndex < statusOrder.length - 1;

  const currentCol = COLUMNS.find((c) => c.id === card.status)!;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group rounded-xl border transition-all duration-200 ${
          isDragging ? "dragging-card" : ""
        } ${isDragOverlay ? "drag-overlay-card" : ""}`}
        {...attributes}
      >
        <div
          style={{
            background: "#211f35",
            border: "1px solid #2e2b4a",
            borderRadius: "12px",
            padding: "14px",
            cursor: isDragOverlay ? "grabbing" : "default",
          }}
        >
          {/* Drag Handle + Status dot */}
          <div className="flex items-start gap-2 mb-2">
            <div
              {...listeners}
              className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
              title="Drag to move"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="4" cy="4" r="1.5" fill="#4a4770" />
                <circle cx="10" cy="4" r="1.5" fill="#4a4770" />
                <circle cx="4" cy="10" r="1.5" fill="#4a4770" />
                <circle cx="10" cy="10" r="1.5" fill="#4a4770" />
              </svg>
            </div>

            <div
              className="w-2 h-2 rounded-full shrink-0 mt-1.5"
              style={{ background: currentCol.accent }}
            />

            <h3
              className="flex-1 text-sm font-medium leading-snug"
              style={{ color: "#e8e6f0" }}
            >
              {card.title}
            </h3>
          </div>

          {/* Description */}
          {card.description && (
            <p
              className="text-xs leading-relaxed mb-3 ml-6"
              style={{ color: "#6b6890" }}
            >
              {card.description.length > 100
                ? card.description.slice(0, 100) + "…"
                : card.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between ml-6">
            <span className="text-xs" style={{ color: "#4a4770", fontFamily: "var(--font-mono)" }}>
              {formatDate(card.createdAt)}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Move Back */}
              {canMoveBack && (
                <button
                  onClick={() => onMove(card.id, statusOrder[colIndex - 1])}
                  title="Move back"
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                  style={{ color: "#6b6890" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2e2b4a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M7 2L3 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {/* Move Forward */}
              {canMoveForward && (
                <button
                  onClick={() => onMove(card.id, statusOrder[colIndex + 1])}
                  title="Move forward"
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                  style={{ color: "#6b6890" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2e2b4a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {/* Edit */}
              <button
                onClick={() => setShowEdit(true)}
                title="Edit card"
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={{ color: "#6b6890" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#2e2b4a"; (e.currentTarget as HTMLElement).style.color = "#7c6af7"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b6890"; }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Delete */}
              <button
                onClick={() => setShowDelete(true)}
                title="Delete card"
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={{ color: "#6b6890" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.12)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b6890"; }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1.5 3h9M4 3V2h4v1M9.5 3l-.75 7h-5.5L2.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <CardModal
          mode="edit"
          card={card}
          onClose={() => setShowEdit(false)}
          onSubmit={(t, d) => onUpdate(card.id, t, d)}
        />
      )}
      {showDelete && (
        <DeleteModal
          title={card.title}
          onClose={() => setShowDelete(false)}
          onConfirm={() => { onDelete(card.id); setShowDelete(false); }}
        />
      )}
    </>
  );
}
