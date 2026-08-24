import { create } from "zustand";

export type IncomingDrop = {
  code: string;
  discount: string;
  id: number;
};

type DropState = {
  incoming: IncomingDrop | null;
  offer: (drop: { code: string; discount: string }) => void;
  clear: () => void;
};

let seq = 0;

export const useDropStore = create<DropState>((set) => ({
  incoming: null,
  offer: (drop) => set({ incoming: { ...drop, id: ++seq } }),
  clear: () => set({ incoming: null }),
}));
