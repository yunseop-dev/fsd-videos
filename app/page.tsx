import { getBoardList } from "@/features/board-list/api/boardApi";
import { BoardWidget } from "@/widgets/board/board-widget";

export default async function BoardPage() {
  const response = await getBoardList(process.env.FOLDER_ID!);

  return (
    <main>
      <BoardWidget boards={response.data.items} />
    </main>
  );
}
