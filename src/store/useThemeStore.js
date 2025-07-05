import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chatme-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("chatme-theme", theme);
    set({ theme });
  },
}));
