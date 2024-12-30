// src/shared/lib/decode.ts
import { ParsedScript } from "@/entities/script/model/types";
import pako from "pako";

export const decodeScript = (base64String: string): ParsedScript | null => {
  try {
    // base64 디코딩
    const binaryString = atob(base64String);

    // 바이너리 문자열을 Uint8Array로 변환
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // gzip 압축 해제
    const decompressed = pako.inflate(bytes);

    // UTF-8 디코딩
    const decoder = new TextDecoder("utf-8");
    const jsonString = decoder.decode(decompressed);

    // JSON 파싱
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode script:", error);
    return null;
  }
};
