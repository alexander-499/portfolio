import { defineStore } from "pinia";

export interface SettingsStoreState {
  colorScheme: "dark" | "light";
  soundEnabled: boolean;
}

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsStoreState => ({
    colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    soundEnabled: true
  }),
  persist: {
    pick: ["colorScheme", "soundEnabled"]
  }
});