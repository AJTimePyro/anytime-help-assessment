"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Role,
  Lang,
  Status,
  User,
  Complaint,
  Notice,
  Contact,
  ResidentRecord,
  DraftComplaint,
} from "../types";
import { generateSeedData, getDemoUsers } from "../seed";

export interface AppState {
  user: User | null;
  lang: Lang;
  complaints: Complaint[];
  nextComplaintNumber: number;
  notices: Notice[];
  contacts: Contact[];
  residents: ResidentRecord[];
  /** Complaint or Notice ID -> ISO timestamp when user last viewed it */
  lastSeen: Record<string, string>;
  draft: DraftComplaint;

  login: (role: Role, phone: string) => void;
  logout: () => void;
  setLanguage: (lang: Lang) => void;
  updateProfile: (name: string, address: string) => void;

  setDraft: (partial: Partial<DraftComplaint>) => void;
  clearDraft: () => void;

  addComplaint: (data: {
    categoryId: string;
    subId: string;
    description: string;
    photos: string[];
    location: string;
    commonArea: boolean;
  }) => Complaint;
  updateComplaintStatus: (
    id: string,
    newStatus: Status,
    byName: string,
    note?: string,
  ) => void;
  addComplaintReply: (
    id: string,
    text: string,
    byName: string,
    byRole: Role,
  ) => void;

  markLastSeen: (id: string) => void;
  addNotice: (data: Omit<Notice, "id" | "createdAt">) => Notice;
  resetDemoData: () => void;
}

const defaultDraft: DraftComplaint = {
  photos: [],
  description: "",
  location: "",
  commonArea: false,
};

const initialSeed = generateSeedData();

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      lang: "en",
      complaints: initialSeed.complaints,
      nextComplaintNumber: initialSeed.nextComplaintNumber,
      notices: initialSeed.notices,
      contacts: initialSeed.contacts,
      residents: initialSeed.residents,
      lastSeen: {},
      draft: defaultDraft,

      login: (role: Role, phone: string) => {
        const seedUsers = getDemoUsers();
        const targetUser = seedUsers[role] || {
          id: `usr_${Date.now()}`,
          role,
          name: role === "member" ? "Rajesh Verma" : "Prince Kumar",
          phone: phone || (role === "member" ? "9000000020" : "9000000010"),
          address: role === "member" ? "B-12, Block B" : "",
        };
        set({
          user: {
            ...targetUser,
            phone: phone || targetUser.phone,
          },
        });
      },

      logout: () => {
        set({ user: null, draft: defaultDraft });
      },

      setLanguage: (lang: Lang) => {
        set({ lang });
        if (typeof document !== "undefined") {
          document.documentElement.lang = lang;
        }
      },

      updateProfile: (name: string, address: string) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({
          user: {
            ...currentUser,
            name,
            address,
          },
        });
      },

      setDraft: (partial) => {
        set((state) => ({
          draft: { ...state.draft, ...partial },
        }));
      },

      clearDraft: () => {
        set({ draft: defaultDraft });
      },

      addComplaint: (data) => {
        const { user, nextComplaintNumber, complaints } = get();
        const id = `AH-${nextComplaintNumber}`;
        const now = new Date().toISOString();
        const reporterName = user?.name || "Anonymous";
        const reporterFlat = user?.address || data.location || "Society";

        const newComplaint: Complaint = {
          id,
          categoryId: data.categoryId,
          subId: data.subId,
          description: data.description,
          photos: data.photos,
          location: data.location,
          commonArea: data.commonArea,
          reporterId: user?.id || "anon",
          reporterName,
          reporterFlat,
          status: "pending",
          createdAt: now,
          updatedAt: now,
          statusHistory: [
            {
              status: "pending",
              at: now,
              byName: reporterName,
            },
          ],
          replies: [],
        };

        set({
          complaints: [newComplaint, ...complaints],
          nextComplaintNumber: nextComplaintNumber + 1,
          draft: defaultDraft,
        });

        return newComplaint;
      },

      updateComplaintStatus: (id, newStatus, byName, note) => {
        const now = new Date().toISOString();
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id !== id) return c;
            return {
              ...c,
              status: newStatus,
              updatedAt: now,
              statusHistory: [
                ...c.statusHistory,
                {
                  status: newStatus,
                  at: now,
                  byName,
                  note,
                },
              ],
            };
          }),
        }));
      },

      addComplaintReply: (id, text, byName, byRole) => {
        const now = new Date().toISOString();
        set((state) => ({
          complaints: state.complaints.map((c) => {
            if (c.id !== id) return c;
            return {
              ...c,
              updatedAt: now,
              replies: [
                ...c.replies,
                {
                  id: `rep_${Date.now()}`,
                  byName,
                  byRole,
                  text,
                  at: now,
                },
              ],
            };
          }),
        }));
      },

      markLastSeen: (id: string) => {
        set((state) => ({
          lastSeen: {
            ...state.lastSeen,
            [id]: new Date().toISOString(),
          },
        }));
      },

      addNotice: (data) => {
        const id = `nt_${Date.now()}`;
        const newNotice: Notice = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          notices: [newNotice, ...state.notices],
        }));
        return newNotice;
      },

      resetDemoData: () => {
        const fresh = generateSeedData(Date.now());
        set({
          complaints: fresh.complaints,
          nextComplaintNumber: fresh.nextComplaintNumber,
          notices: fresh.notices,
          contacts: fresh.contacts,
          residents: fresh.residents,
          lastSeen: {},
          draft: defaultDraft,
        });
      },
    }),
    {
      name: "ah-demo-v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        lang: state.lang,
        complaints: state.complaints,
        nextComplaintNumber: state.nextComplaintNumber,
        notices: state.notices,
        contacts: state.contacts,
        residents: state.residents,
        lastSeen: state.lastSeen,
        draft: state.draft,
      }),
    },
  ),
);
