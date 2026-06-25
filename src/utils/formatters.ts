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

export function adjustNameFormatting(text: any): string {
  if (valueIsEmpty(text)) return "";
  let str = String(text);
  
  // Replace "Osita Insights" (and variations) with "OsitaInsight"
  str = str.replace(/\bOsita\s+Insights\b/gi, 'OsitaInsight');
  str = str.replace(/\bOsitaInsights\b/gi, 'OsitaInsight');
  str = str.replace(/\bositainsight\b/gi, 'OsitaInsight');
  str = str.replace(/\bositainsights\b/gi, 'OsitaInsight');
  
  // Replace "Clearpath" or "clearpath" with "ClearPath" case-insensitively
  str = str.replace(/\bClearpath\b/g, 'ClearPath');
  str = str.replace(/\bclearpath\b/g, 'ClearPath');
  str = str.replace(/\bCLEARPATH\b/g, 'ClearPath');
  
  return str;
}

function valueIsEmpty(val: any): boolean {
  return val === null || val === undefined || String(val).trim() === '';
}

export function adjustObjectFormatting<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle Firestore Timestamp or special objects without traversing them recursively
  if ('seconds' in obj && 'nanoseconds' in obj) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => adjustObjectFormatting(item)) as unknown as T;
  }
  
  const copy = { ...obj } as any;
  for (const key of Object.keys(copy)) {
    const val = copy[key];
    if (typeof val === 'string') {
      copy[key] = adjustNameFormatting(val);
    } else if (typeof val === 'object' && val !== null) {
      copy[key] = adjustObjectFormatting(val);
    }
  }
  return copy as T;
}
