export type Status = "pending" | "in-progress" | "completed";

export interface Card {
  id: string;
  title: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: Status;
  label: string;
  color: string;
  accent: string;
  dotColor: string;
}

export const COLUMNS: Column[] = [
  {
    id: "pending",
    label: "Pending",
    color: "amber",
    accent: "#f4a435",
    dotColor: "bg-amber-400",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "purple",
    accent: "#7c6af7",
    dotColor: "bg-purple-400",
  },
  {
    id: "completed",
    label: "Completed",
    color: "emerald",
    accent: "#34d399",
    dotColor: "bg-emerald-400",
  },
];
