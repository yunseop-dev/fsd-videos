import React from "react";
import { BoardList } from "@/features/board-list/ui/board-list";
import type { Board } from "@/entities/board/model/types";

interface BoardWidgetProps {
  boards: Board[];
}

export const BoardWidget = ({ boards }: BoardWidgetProps) => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">게시판</h1>
        <BoardList boards={boards} />
      </div>
    </div>
  );
};
