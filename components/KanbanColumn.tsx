"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, Column as ColumnType, Status } from "@/types";
import KanbanCard from "./KanbanCard";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  onUpdate: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: Status) => void;
  onAddCard: () => void;
}

export default function KanbanColumn({
  column,
  cards,
  onUpdate,
  onDelete,
  onMove,
  onAddCard,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-0 w-full">
      {/* Column Header */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
        style={{
          background: "#1a1827",
          border: `1px solid #2e2b4a`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: column.accent, boxShadow: `0 0 8px ${column.accent}60` }}
          />
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: "#e8e6f0" }}
          >
            {column.label}
          </span>
          <span
            className="text-xs font-mono px-1.5 py-0.5 rounded-md"
            style={{
              background: `${column.accent}18`,
              color: column.accent,
              fontFamily: "var(--font-mono)",
            }}
          >
            {cards.length}
          </span>
        </div>

        <button
          onClick={onAddCard}
          title="Add card"
          className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
          style={{ color: "#4a4770" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = `${column.accent}20`;
            (e.currentTarget as HTMLElement).style.color = column.accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#4a4770";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl transition-all duration-200 min-h-[60px] ${
          isOver ? "drop-target" : ""
        }`}
        style={{
          border: `1px solid ${isOver ? column.accent + "40" : "#2e2b4a"}`,
          background: isOver ? `${column.accent}08` : "#14121f",
          padding: "8px",
        }}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {cards.map((card) => (
              <div key={card.id} className="animate-fade-in">
                <KanbanCard
                  card={card}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onMove={onMove}
                />
              </div>
            ))}
          </div>
        </SortableContext>

        {cards.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-10 text-center"
            style={{ color: "#3a3760" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mb-3 opacity-40">
              <rect x="6" y="8" width="20" height="4" rx="2" fill="currentColor" opacity="0.5" />
              <rect x="6" y="16" width="14" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
              <rect x="6" y="22" width="10" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
            </svg>
            <p className="text-xs">No cards yet</p>
            <button
              onClick={onAddCard}
              className="mt-2 text-xs transition-colors"
              style={{ color: column.accent + "80" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = column.accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = column.accent + "80"; }}
            >
              + Add one
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
