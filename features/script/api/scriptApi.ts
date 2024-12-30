// src/features/script/api/scriptApi.ts
import { api } from "@/shared/api/base";
import type { ScriptResponse } from "@/entities/script/model/types";

export const getScript = async (fileMetaId: string, page = 0, limit = 60) => {
  return api.get<ScriptResponse>(`/file-meta/${fileMetaId}/script`, {
    params: {
      page,
      limit,
    },
  });
};
