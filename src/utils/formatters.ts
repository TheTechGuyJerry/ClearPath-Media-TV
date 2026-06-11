/**
 * Utility formattters and defensive handlers to prevent React JSX rendering crashes.
 */

export function formatFirestoreDate(value: any, fallback = "Not available"): string {
  if (!value) return fallback;

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString();
    }

    if (typeof value === "object" && typeof value.seconds === "number") {
      return new Date(value.seconds * 1000).toLocaleDateString();
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    if (typeof value === "string" || typeof value === "number") {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    return fallback;
  } catch (error) {
    console.error("Date formatting error:", error, value);
    return fallback;
  }
}

export function safeReactText(value: any, fallback = ""): string {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  if (typeof value?.toDate === "function") {
    return formatFirestoreDate(value, fallback);
  }

  if (typeof value === "object" && typeof value.seconds === "number") {
    return formatFirestoreDate(value, fallback);
  }

  if (Array.isArray(value)) return value.join(", ");

  return fallback;
}

export function safeArray<T = any>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

export function renderSafe(value: any, fallback = ""): string {
  return safeReactText(value, fallback);
}
