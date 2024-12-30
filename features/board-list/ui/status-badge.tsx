import React from "react";

interface StatusBadgeProps {
  status: string;
  progress: number;
}

export const StatusBadge = ({ status, progress }: StatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status === "COMPLETE" ? "완료" : `진행중 ${progress}%`}
    </span>
  );
};
