import { defineStore } from "pinia";

export interface UiStoreState {
  isSuperheader: boolean;
  isMobileMenu: boolean;
}

export const useUiStore = defineStore("ui", {
  state: (): UiStoreState => ({
    isSuperheader: true,
    isMobileMenu: false
  }),
  persist: {
    pick: ["isSuperheader"]
  }
});