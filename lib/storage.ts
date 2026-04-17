import { Card } from "@/types";

const STORAGE_KEY = "kanban_cards";

export function loadCards(): Card[] {
  // can't access localStorage during SSR
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCards();
    return JSON.parse(raw) as Card[];
  } catch (err) {
    console.warn("Failed to parse saved cards, falling back to defaults", err);
    return getDefaultCards();
  }
}

export function saveCards(cards: Card[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// seed data so the board isn't empty on first load
function getDefaultCards(): Card[] {
  const now = Date.now();
  const day = 86400000;

  return [
    {
      id: "demo-1",
      title: "Set up project structure",
      description: "Initialize Next.js with TypeScript and Tailwind CSS configuration.",
      status: "completed",
      createdAt: new Date(now - day * 2).toISOString(),
      updatedAt: new Date(now - day * 2).toISOString(),
    },
    {
      id: "demo-2",
      title: "Design Kanban UI",
      description: "Create column layout, card components, and responsive board view.",
      status: "in-progress",
      createdAt: new Date(now - day).toISOString(),
      updatedAt: new Date(now - 3600000).toISOString(),
    },
    {
      id: "demo-3",
      title: "Implement drag and drop",
      description: "Add @dnd-kit for drag-and-drop between columns and within columns.",
      status: "pending",
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
    {
      id: "demo-4",
      title: "Write unit tests",
      // TODO: decide between Jest and Vitest
      description: "Cover card CRUD operations and state transitions.",
      status: "pending",
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    },
  ];
}
