import { api } from "@/shared/api/base";
import type { BoardListResponse } from "../model/types";

export const getBoardList = (folderId: string, page = 1) => {
  return api.get<BoardListResponse>("/v2/boards", {
    params: {
      page,
      limit: 30,
      sort: "createTime.desc",
      "filter.folderIds": folderId,
    },
  });
};
