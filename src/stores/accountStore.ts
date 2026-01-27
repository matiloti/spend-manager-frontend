import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AccountState {
  activeAccountId: string | null;
  setActiveAccount: (id: string) => void;
  clearActiveAccount: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      activeAccountId: null,
      setActiveAccount: (id) => set({ activeAccountId: id }),
      clearActiveAccount: () => set({ activeAccountId: null }),
    }),
    {
      name: "account-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
