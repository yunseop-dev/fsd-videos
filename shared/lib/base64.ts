// src/shared/lib/base64.ts
export const decodeBase64 = (base64String: string): string => {
  try {
    // Browser
    if (typeof window !== "undefined") {
      return atob(base64String);
    }
    // Node.js
    return Buffer.from(base64String, "base64").toString("utf-8");
  } catch (error) {
    console.error("Failed to decode base64 string:", error);
    return "";
  }
};
