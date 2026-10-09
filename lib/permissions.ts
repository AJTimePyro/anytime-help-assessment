import { Role } from "./types";

export type PermissionAction =
  | "raise_complaint"
  | "see_all_complaints"
  | "change_status"
  | "reply_to_complaint"
  | "post_notice"
  | "see_all_notices"
  | "view_directory"
  | "view_residents_list";

export function can(role: Role, action: PermissionAction): boolean {
  switch (action) {
    case "raise_complaint":
      return true; // both can raise
    case "see_all_complaints":
      return role === "member";
    case "change_status":
      return role === "member";
    case "reply_to_complaint":
      return true; // residents can reply on own, members on any
    case "post_notice":
      return role === "member";
    case "see_all_notices":
      return role === "member";
    case "view_directory":
      return true;
    case "view_residents_list":
      return role === "member";
    default:
      return false;
  }
}
