import { create } from "zustand";

interface ThemeStore {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    isDark: false,

    initTheme: () => {
        const stored = localStorage.getItem("theme");
        const isDark = stored === "dark";
        document.documentElement.classList.toggle("dark", isDark);
        set({ isDark });
    },

    toggleTheme: () => {
        const isDark = !get().isDark;
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
        set({ isDark });
    },
}));