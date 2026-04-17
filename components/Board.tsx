"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { COLUMNS, Card, Status } from "@/types";
import { useCards } from "@/hooks/useCards";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import CardModal from "./CardModal";

export default function Board() {
  const { cards, isLoaded, createCard, updateCard, moveCard, deleteCard, reorderCards } =
    useCards();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  // track which column the "new card" modal was opened from
  const [defaultColumn, setDefaultColumn] = useState<Status>("pending");

  // the card being dragged right now (for overlay)
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // require 6px of movement before drag starts — avoids accidental drags on click
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [cards, search]);

  const cardsByStatus = (status: Status) =>
    filteredCards.filter((c) => c.status === status);

  const handleDragStart = (e: DragStartEvent) => {
    const found = cards.find((c) => c.id === e.active.id);
    setActiveCard(found ?? null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const dragged = cards.find((c) => c.id === activeId);
    if (!dragged) return;

    // dropped over an empty column header
    const targetCol = COLUMNS.find((col) => col.id === overId);
    if (targetCol && dragged.status !== targetCol.id) {
      moveCard(activeId, targetCol.id);
      return;
    }

    // dropped over another card — move to that card's column
    const targetCard = cards.find((c) => c.id === overId);
    if (targetCard && dragged.status !== targetCard.status) {
      moveCard(activeId, targetCard.status);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveCard(null);

    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const dragged = cards.find((c) => c.id === activeId);
    const target = cards.find((c) => c.id === overId);

    // reorder within the same column
    if (dragged && target && dragged.status === target.status) {
      const sameColCards = cards.filter((c) => c.status === dragged.status);
      const from = sameColCards.findIndex((c) => c.id === activeId);
      const to = sameColCards.findIndex((c) => c.id === overId);
      const reordered = arrayMove(sameColCards, from, to);
      const rest = cards.filter((c) => c.status !== dragged.status);
      reorderCards([...rest, ...reordered]);
    }
  };

  const handleCreateCard = (title: string, description: string) => {
    const card = createCard(title, description);
    // createCard always sets status to "pending"
    // so if user clicked + on a different column, move it there
    if (defaultColumn !== "pending") {
      setTimeout(() => moveCard(card.id, defaultColumn), 0);
    }
  };

  const openCreateModal = (status: Status) => {
    setDefaultColumn(status);
    setShowCreate(true);
  };

  const completedCount = cards.filter((c) => c.status === "completed").length;
  const total = cards.length;
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#0f0e17" }}>
      {/* ── Header ── */}
      <header
        className="shrink-0 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 border-b"
        style={{ borderColor: "#1e1c30", background: "#0f0e17" }}
      >
        <div className="flex items-center gap-3 mr-auto">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c6af7, #5b4fd4)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="5" height="14" rx="1.5" fill="white" opacity="0.9" />
              <rect x="9.5" y="2" width="6.5" height="7" rx="1.5" fill="white" opacity="0.6" />
              <rect x="9.5" y="11" width="6.5" height="5" rx="1.5" fill="white" opacity="0.4" />
            </svg>
          </div>
          <div>
            <h1
              className="text-lg leading-none"
              style={{ fontFamily: "var(--font-display)", color: "#e8e6f0" }}
            >
              Kanban Board
            </h1>
            {isLoaded && (
              <p className="text-xs mt-0.5" style={{ color: "#4a4770" }}>
                {completedCount}/{total} done · {progress}%
              </p>
            )}
          </div>
        </div>

        {/* progress bar — only show when there's something to show */}
        {isLoaded && total > 0 && (
          <div className="hidden sm:flex items-center gap-3 w-48">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#1e1c30" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #7c6af7, #34d399)",
                }}
              />
            </div>
            <span className="text-xs tabular-nums" style={{ color: "#4a4770", fontFamily: "var(--font-mono)" }}>
              {progress}%
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <circle cx="6" cy="6" r="4" stroke="#4a4770" strokeWidth="1.3" />
            <path d="M9.5 9.5l2.5 2.5" stroke="#4a4770" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards…"
            className="pl-8 pr-4 py-2 text-sm rounded-xl outline-none w-48"
            style={{ background: "#1a1827", border: "1px solid #2e2b4a", color: "#e8e6f0" }}
            onFocus={(e) => { e.target.style.borderColor = "#7c6af7"; }}
            onBlur={(e) => { e.target.style.borderColor = "#2e2b4a"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#4a4770" }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={() => openCreateModal("pending")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "linear-gradient(135deg, #7c6af7, #5b4fd4)", color: "#fff" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          New Card
        </button>
      </header>

      {/* ── Board ── */}
      <div className="flex-1 overflow-auto p-5">
        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="skeleton h-10 w-full" />
                {[0, 1].slice(0, 2 - (i % 2)).map((j) => (
                  <div key={j} className="skeleton h-24 w-full" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full min-h-0">
              {COLUMNS.map((col) => (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  cards={cardsByStatus(col.id)}
                  onUpdate={updateCard}
                  onDelete={deleteCard}
                  onMove={moveCard}
                  onAddCard={() => openCreateModal(col.id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeCard && (
                <KanbanCard
                  card={activeCard}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onMove={() => {}}
                  isDragOverlay
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* no results toast */}
      {isLoaded && search && filteredCards.length === 0 && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl text-sm border"
          style={{ background: "#1a1827", borderColor: "#2e2b4a", color: "#6b6890" }}
        >
          No cards match &ldquo;<span style={{ color: "#e8e6f0" }}>{search}</span>&rdquo;
        </div>
      )}

      {showCreate && (
        <CardModal
          mode="create"
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreateCard}
        />
      )}
    </div>
  );
}
