import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

const memory = new Map<string, string>();

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {
      memory.set(name, value);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      memory.delete(name);
    }
  },
};

type ThanksState = {
  thanked: number[];
  hasThanked: (codeId: number) => boolean;
  markThanked: (codeId: number) => void;
};

export const useThanksStore = create<ThanksState>()(
  persist(
    (set, get) => ({
      thanked: [],
      hasThanked: (codeId) => get().thanked.includes(codeId),
      markThanked: (codeId) =>
        set((s) =>
          s.thanked.includes(codeId) ? s : { thanked: [...s.thanked, codeId] },
        ),
    }),
    {
      name: "code-jar-thanks",
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
