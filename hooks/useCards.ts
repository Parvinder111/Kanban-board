"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, Status } from "@/types";
import { loadCards, saveCards } from "@/lib/storage";

// central hook for all card operations
// keeps storage logic out of components
export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // load from localStorage on mount
  useEffect(() => {
    const saved = loadCards();
    setCards(saved);
    setIsLoaded(true);
  }, []);

  // helper to update state + sync to storage at the same time
  const persist = useCallback((updated: Card[]) => {
    setCards(updated);
    saveCards(updated);
  }, []);

  const createCard = useCallback(
    (title: string, description: string) => {
      const now = new Date().toISOString();
      const newCard: Card = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };
      persist([...cards, newCard]);
      return newCard;
    },
    [cards, persist]
  );

  const updateCard = useCallback(
    (id: string, title: string, description: string) => {
      const updated = cards.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          title: title.trim(),
          description: description.trim(),
          updatedAt: new Date().toISOString(),
        };
      });
      persist(updated);
    },
    [cards, persist]
  );

  const moveCard = useCallback(
    (id: string, status: Status) => {
      const updated = cards.map((c) =>
        c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
      );
      persist(updated);
    },
    [cards, persist]
  );

  const deleteCard = useCallback(
    (id: string) => {
      const remaining = cards.filter((c) => c.id !== id);
      persist(remaining);
    },
    [cards, persist]
  );

  // used by dnd after drag ends to persist new order
  const reorderCards = useCallback(
    (reordered: Card[]) => {
      persist(reordered);
    },
    [persist]
  );

  return { cards, isLoaded, createCard, updateCard, moveCard, deleteCard, reorderCards };
}
