export type Role = "resident" | "member";
export type Lang = "en" | "hi";
export type Status = "pending" | "in_progress" | "resolved";

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  address?: string;
  memberId?: string;
  designation?: string;
}

export interface SubCategory {
  id: string;
  name: Record<Lang, string>;
}

export interface Category {
  id: string;
  icon: string;
  name: Record<Lang, string>;
  short: Record<Lang, string>;
  defaultCommonArea: boolean;
  subs: SubCategory[];
}

export interface StatusHistoryEntry {
  status: Status;
  at: string;
  byName: string;
  note?: string;
}

export interface ComplaintReply {
  id: string;
  byName: string;
  byRole: Role;
  text: string;
  at: string;
}

export interface Complaint {
  id: string; // e.g. "AH-1042"
  categoryId: string;
  subId: string;
  description: string;
  photos: string[];
  location: string;
  commonArea: boolean;
  reporterId: string;
  reporterName: string;
  reporterFlat: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
  replies: ComplaintReply[];
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  image?: string;
  topic: string;
  important: boolean;
  audience: "all" | "residents" | "members";
  byName: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  type: "office" | "emergency";
}

export interface ResidentRecord {
  id: string;
  name: string;
  phone: string;
  house: string;
  block: string;
  society: string;
  ownership: "owned" | "rented";
}

export interface DraftComplaint {
  categoryId?: string;
  subId?: string;
  photos: string[];
  description: string;
  location: string;
  commonArea: boolean;
}
