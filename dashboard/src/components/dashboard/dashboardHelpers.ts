import type { ToolStatus } from "../../types/dashboard.types";

export function getBandLabel(band: string): string {
  switch (band) {
    case "thriving":           return "Thriving";
    case "established":        return "Established";
    case "developing":         return "Developing";
    case "at_risk":            return "At risk";
    case "critical":           return "Critical — action needed";
    // Legacy band names from older score versions
    case "strong":             return "Strong";
    case "good_foundation":    return "Good foundation";
    case "needs_attention":    return "Needs attention";
    case "financial_stress_risk": return "Financial stress risk";
    case "urgent_action_needed":  return "Urgent action needed";
    default:                   return "Result ready";
  }
}

export function formatDisplayDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getToolStatusLabel(status: ToolStatus): string {
  switch (status) {
    case "not_started": return "Not started";
    case "in_progress": return "In progress";
    case "completed":   return "Completed";
    default:            return "Not started";
  }
}

export function getActivityStatusLabel(
  status: "completed" | "in_progress" | "pending",
): string {
  switch (status) {
    case "completed":   return "Completed";
    case "in_progress": return "In progress";
    case "pending":     return "Pending";
    default:            return "Pending";
  }
}
