// src/features/script/lib/scriptParser.ts
import { decodeScript } from "@/shared/lib/decode";

export interface Subtitle {
  text: string;
  startTime: number;
  endTime?: number;
  speaker?: string;
}

export interface ParsedScript {
  subtitles: Subtitle[];
  metadata: {
    lastSaved: number;
    source: string;
    version: string;
  };
}

export const parseScript = (base64Content: string): ParsedScript | null => {
  try {
    const decodedContent = decodeScript(base64Content);
    if (!decodedContent) {
      throw new Error("Failed to decode content");
    }

    const tempSubtitles: Subtitle[] = [];

    let currentSentence = "";
    let currentStartTime = 0;
    let currentSpeaker = "";
    let isFirstNode = true;

    // 먼저 모든 자막을 수집 (endTime이 없을 수 있음)
    decodedContent.editorState.root.children.forEach((paragraph) => {
      const karaokeNodes = paragraph.children.filter(
        (child) => child.type === "karaoke"
      );

      paragraph.children.forEach((child) => {
        if (child.type === "speaker-block" && child.speaker) {
          currentSpeaker = child.speaker;
          return;
        }

        if (child.type === "karaoke" && child.text) {
          const text = child.text;
          if (!text) return;

          if (isFirstNode) {
            currentStartTime = child.s || 0;
            isFirstNode = false;
          }

          currentSentence += text;

          // 구두점으로 끝나는 경우
          if (text.match(/[.!?](\s|$)/)) {
            tempSubtitles.push({
              text: currentSentence.trim(),
              startTime: currentStartTime,
              endTime: child.e,
              speaker: currentSpeaker,
            });

            currentSentence = "";
            isFirstNode = true;
          }
        }
      });

      // 단락이 끝났는데 남은 문장이 있다면 추가
      if (currentSentence.trim()) {
        const lastChild = karaokeNodes[karaokeNodes.length - 1];
        tempSubtitles.push({
          text: currentSentence.trim(),
          startTime: currentStartTime,
          endTime: lastChild?.e,
          speaker: currentSpeaker,
        });

        currentSentence = "";
        isFirstNode = true;
      }
    });

    // endTime이 없는 자막들의 endTime을 다음 자막의 startTime으로 설정
    const subtitles = tempSubtitles.map((subtitle, index) => {
      if (!subtitle.endTime && index < tempSubtitles.length - 1) {
        return {
          ...subtitle,
          endTime: tempSubtitles[index + 1].startTime,
        };
      }
      // 마지막 자막이고 endTime이 없는 경우, 시작 시간 + 3초로 설정
      if (!subtitle.endTime && index === tempSubtitles.length - 1) {
        return {
          ...subtitle,
          endTime: subtitle.startTime + 3,
        };
      }
      return {
        ...subtitle,
        endTime: subtitle.endTime || subtitle.startTime,
      };
    });

    return {
      subtitles,
      metadata: {
        lastSaved: decodedContent.lastSaved,
        source: decodedContent.source,
        version: decodedContent.version,
      },
    };
  } catch (error) {
    console.error("Failed to parse script:", error);
    return null;
  }
};

// 시간을 포맷팅하는 유틸리티 함수
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) {
    parts.push(hours.toString().padStart(2, "0"));
  }
  parts.push(minutes.toString().padStart(2, "0"));
  parts.push(secs.toString().padStart(2, "0"));

  return parts.join(":");
};
