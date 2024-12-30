// src/features/script/ui/script-content.tsx
"use client";
import React, { useState, useEffect } from "react";
import YouTube, { YouTubeProps, type YouTubePlayer } from "react-youtube";
import { ParsedScript, Subtitle, formatTime } from "../lib/scriptParser";

interface ScriptContentProps {
  script: ParsedScript;
  meta: {
    onlineMediaUrl: string;
    signedUrl: string;
  };
}

export const ScriptContent = ({ script, meta }: ScriptContentProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);

  // YouTube 동영상 ID 추출
  const getYoutubeId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : "";
  };

  // 현재 시간에 맞는 자막 업데이트
  useEffect(() => {
    const currentSub = script.subtitles.find(
      (subtitle) =>
        currentTime >= subtitle.startTime && currentTime <= subtitle.endTime
    );

    if (currentSub) {
      setCurrentSubtitle(currentSub);
    }
  }, [currentTime, script.subtitles]);

  // YouTube 플레이어 이벤트 핸들러
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    setPlayer(event.target);
  };

  useEffect(() => {
    if (!player) return;

    const timer = setInterval(() => {
      setCurrentTime(player.getCurrentTime());
    }, 100);

    return () => clearInterval(timer);
  }, [player]);

  // 자막 클릭 핸들러
  const handleSubtitleClick = (startTime: number) => {
    if (player) {
      player.seekTo(startTime);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* 비디오 플레이어 */}
      <div className="relative pt-[56.25%] bg-black">
        <div className="absolute inset-0">
          <YouTube
            videoId={getYoutubeId(meta.onlineMediaUrl)}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 0,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onReady={onPlayerReady}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 현재 자막 */}
      <div className="bg-black/90 p-4 text-center min-h-[80px] flex items-center justify-center">
        <p className="text-white text-lg font-medium">
          {currentSubtitle?.speaker && (
            <span className="text-gray-400 mr-2">
              {currentSubtitle.speaker}:
            </span>
          )}
          {currentSubtitle?.text || ""}
        </p>
      </div>

      {/* 전체 스크립트 */}
      <div className="mt-4 max-h-[400px] overflow-y-auto bg-white rounded-lg shadow">
        <div className="p-4 space-y-2">
          {script.subtitles.map((subtitle, index) => (
            <div
              key={index}
              onClick={() => handleSubtitleClick(subtitle.startTime)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                currentSubtitle === subtitle ? "bg-yellow-100" : ""
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {formatTime(subtitle.startTime)}
                </span>
                <div className="flex-1">
                  {subtitle.speaker && (
                    <span className="font-medium text-gray-700 mr-2">
                      {subtitle.speaker}:
                    </span>
                  )}
                  <span>{subtitle.text}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
