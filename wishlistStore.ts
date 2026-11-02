import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  handles: string[];
  toggle: (handle: string) => void;
  has: (handle: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      handles: [],
      toggle: (h) =>
        set({ handles: get().handles.includes(h) ? get().handles.filter((x) => x !== h) : [...get().handles, h] }),
      has: (h) => get().handles.includes(h),
    }),
    { name: "nest-wishlist", storage: createJSONStorage(() => localStorage) },
  ),
);
