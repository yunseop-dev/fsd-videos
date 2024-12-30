import { Board } from "@/entities/board/model/types";

export interface BoardListResponse {
  items: Board[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
