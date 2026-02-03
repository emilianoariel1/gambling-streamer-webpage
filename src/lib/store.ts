import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Giveaway, BonusHunt, Bonus, BonusHuntGuess, StreamInfo, Notification } from '@/types';

interface StoreUser {
  id: string;
  username: string;
  avatar?: string;
  points: number;
  isVip: boolean;
  isModerator: boolean;
}

interface AppState {
  // User state
  user: StoreUser | null;
  setUser: (user: StoreUser | null) => void;
  updateUserPoints: (points: number) => void;

  // Giveaway state
  activeGiveaways: Giveaway[];
  setActiveGiveaways: (giveaways: Giveaway[]) => void;
  addGiveaway: (giveaway: Giveaway) => void;
  updateGiveaway: (giveaway: Giveaway) => void;

  // Bonus Hunt state
  bonusHunts: BonusHunt[];
  activeBonusHunt: BonusHunt | null;
  setBonusHunts: (hunts: BonusHunt[]) => void;
  setActiveBonusHunt: (hunt: BonusHunt | null) => void;
  addBonusHunt: (hunt: BonusHunt) => void;
  updateBonusHunt: (hunt: BonusHunt) => void;
  addGuessToHunt: (huntId: string, guess: BonusHuntGuess) => void;
  updateBonusInHunt: (huntId: string, bonus: Bonus) => void;

  // Stream state
  streamInfo: StreamInfo;
  setStreamInfo: (info: StreamInfo) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUserPoints: (points) =>
        set((state) => ({
          user: state.user ? { ...state.user, points } : null,
        })),

      // Giveaways
      activeGiveaways: [],
      setActiveGiveaways: (giveaways) => set({ activeGiveaways: giveaways }),
      addGiveaway: (giveaway) =>
        set((state) => ({
          activeGiveaways: [...state.activeGiveaways, giveaway],
        })),
      updateGiveaway: (giveaway) =>
        set((state) => ({
          activeGiveaways: state.activeGiveaways.map((g) =>
            g.id === giveaway.id ? giveaway : g
          ),
        })),

      // Bonus Hunts
      bonusHunts: [],
      activeBonusHunt: null,
      setBonusHunts: (hunts) => set({ bonusHunts: hunts }),
      setActiveBonusHunt: (hunt) => set({ activeBonusHunt: hunt }),
      addBonusHunt: (hunt) =>
        set((state) => ({
          bonusHunts: [hunt, ...state.bonusHunts],
        })),
      updateBonusHunt: (hunt) =>
        set((state) => ({
          bonusHunts: state.bonusHunts.map((h) =>
            h.id === hunt.id ? hunt : h
          ),
          activeBonusHunt: state.activeBonusHunt?.id === hunt.id ? hunt : state.activeBonusHunt,
        })),
      addGuessToHunt: (huntId, guess) =>
        set((state) => ({
          bonusHunts: state.bonusHunts.map((h) =>
            h.id === huntId ? { ...h, guesses: [...h.guesses, guess] } : h
          ),
          activeBonusHunt:
            state.activeBonusHunt?.id === huntId
              ? { ...state.activeBonusHunt, guesses: [...state.activeBonusHunt.guesses, guess] }
              : state.activeBonusHunt,
        })),
      updateBonusInHunt: (huntId, bonus) =>
        set((state) => ({
          bonusHunts: state.bonusHunts.map((h) =>
            h.id === huntId
              ? { ...h, bonuses: h.bonuses.map((b) => (b.id === bonus.id ? bonus : b)) }
              : h
          ),
          activeBonusHunt:
            state.activeBonusHunt?.id === huntId
              ? {
                  ...state.activeBonusHunt,
                  bonuses: state.activeBonusHunt.bonuses.map((b) =>
                    b.id === bonus.id ? bonus : b
                  ),
                }
              : state.activeBonusHunt,
        })),

      // Stream
      streamInfo: {
        isLive: false,
        title: '',
        game: '',
        viewerCount: 0,
      },
      setStreamInfo: (info) => set({ streamInfo: info }),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications.slice(0, 49)],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'streamer-hub-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
