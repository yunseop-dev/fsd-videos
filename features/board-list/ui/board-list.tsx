import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Board } from "@/entities/board/model/types";
import { StatusBadge } from "./status-badge";
import Link from "next/link";

interface BoardListProps {
  boards: Board[];
}

export const BoardList = ({ boards }: BoardListProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-gray-600">
        <div className="col-span-6">제목</div>
        <div className="col-span-2">폴더</div>
        <div className="col-span-2">상태</div>
        <div className="col-span-2">생성일</div>
      </div>
      <div className="divide-y">
        {boards.map((board) => (
          <div
            key={board.id}
            className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50"
          >
            <div className="col-span-6 font-medium text-gray-900">
              <Link href={`/${board.fileMetaId}`}>{board.name}</Link>
              {board.isStarred && (
                <span className="ml-2 text-yellow-400">⭐</span>
              )}
            </div>
            <div className="col-span-2 text-gray-600">{board.folder.name}</div>
            <div className="col-span-2">
              <StatusBadge status={board.status} progress={board.progress} />
            </div>
            <div className="col-span-2 text-gray-500">
              {formatDistanceToNow(new Date(board.createTime), {
                addSuffix: true,
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
