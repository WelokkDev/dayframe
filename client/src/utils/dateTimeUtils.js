import { format } from 'date-fns';

/**
 * Formats a task's scheduled date and time for display
 * Shows time only when it's not the default end-of-day time (11:59)
 * @param {string} scheduledAt - ISO timestamp string
 * @param {string|null} preferredTime - Preferred time from recurrence rule (HH:MM format)
 * @returns {string} Formatted date and time string
 */
export function formatTaskDateTime(scheduledAt, preferredTime = null) {
  if (!scheduledAt) return "No due date";
  
  const date = new Date(scheduledAt);
  const formattedDate = format(date, "MMM d");
  
  // If no preferred time, just show the date
  if (!preferredTime) {
    return formattedDate;
  }
  
  // Check if this is the default end-of-day time (11:59)
  const isDefaultEndOfDay = preferredTime === "11:59";
  
  if (isDefaultEndOfDay) {
    // For default end-of-day time, just show the date
    return formattedDate;
  } else {
    // For specific times, show both date and time
    const time = format(date, "h:mm a"); // e.g., "7:00 AM"
    return `${formattedDate} at ${time}`;
  }
}

/**
 * Formats just the time portion of a scheduled task
 * @param {string} scheduledAt - ISO timestamp string
 * @param {string|null} preferredTime - Preferred time from recurrence rule
 * @returns {string|null} Formatted time string or null if no specific time
 */
export function formatTaskTime(scheduledAt, preferredTime = null) {
  if (!scheduledAt || !preferredTime) return null;
  
  // Don't show time for default end-of-day
  if (preferredTime === "11:59") return null;
  
  const date = new Date(scheduledAt);
  return format(date, "h:mm a"); // e.g., "7:00 AM"
}
