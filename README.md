# 📋 Kanban Board

A Trello-like Kanban board built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **@dnd-kit** for drag-and-drop.

## ✨ Features

- **Create Cards** — Add tasks with a title and description (appear in Pending by default)
- **Move Cards** — Drag and drop between columns OR use the arrow buttons on each card
- **Edit Cards** — Edit title and description via a clean modal
- **Delete Cards** — Delete with a confirmation dialog
- **Search / Filter** — Live search across card titles and descriptions
- **Data Persistence** — Cards saved to `localStorage` so they survive page refresh
- **Drag & Drop** — Full drag-and-drop powered by `@dnd-kit`
- **Progress Tracker** — Header shows completed/total ratio with an animated progress bar
- **Loading Skeletons** — Smooth skeleton state while loading from localStorage

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm or yarn

### Installation & Run

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/kanban-board.git
cd kanban-board

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

## 🗂️ Project Structure

```
kanban-board/
├── app/
│   ├── globals.css          # Global styles, CSS variables, animations
│   ├── layout.tsx           # Root layout (Server Component)
│   └── page.tsx             # Home page (Server Component)
├── components/
│   ├── Board.tsx            # Main board with DnD context & state
│   ├── KanbanColumn.tsx     # Droppable column
│   ├── KanbanCard.tsx       # Sortable card with actions
│   ├── CardModal.tsx        # Create / Edit modal
│   └── DeleteModal.tsx      # Delete confirmation modal
├── hooks/
│   └── useCards.ts          # Custom hook — CRUD + persistence
├── lib/
│   └── storage.ts           # localStorage helpers + seed data
├── types/
│   └── index.ts             # TypeScript types & column config
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## 🛠️ Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 15 (App Router) | Framework with Server & Client Components |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| @dnd-kit/core + sortable | Drag and drop |
| localStorage | Client-side persistence |
| uuid | Unique card IDs |

## 🎨 Architecture

- **`app/page.tsx`** — Server Component: renders `<Board />`
- **`components/Board.tsx`** — Client Component: owns state, DnD context, search
- **`components/KanbanColumn.tsx`** — Client Component: droppable zone per status
- **`components/KanbanCard.tsx`** — Client Component: sortable card with inline actions
- **`hooks/useCards.ts`** — Custom hook managing all card CRUD + localStorage sync

## 📦 Deployment

Deploy instantly on [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deploys on push.
