// src/app/boards/[boardId]/page.tsx
import { getBoardList } from "@/features/board-list/api/boardApi";
import { getScript } from "@/features/script/api/scriptApi";
import { parseScript } from "@/features/script/lib/scriptParser";
import { ScriptContent } from "@/features/script/ui/script-content";

type Params = Promise<{
  boardId: string;
}>;
interface BoardDetailPageProps {
  params: Params;
}

export async function generateStaticParams() {
  const response = await getBoardList(process.env.FOLDER_ID!);

  return response.data.items.map((item) => ({ boardId: item.fileMetaId }));
}

export default async function BoardDetailPage(props: BoardDetailPageProps) {
  try {
    const params = await props.params;
    const response = await getScript(params.boardId);
    const parsedScript = parseScript(response.data.item);

    if (!parsedScript) {
      throw new Error("Failed to parse script");
    }

    return (
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <ScriptContent
            script={parsedScript}
            meta={{
              onlineMediaUrl: response.data.meta.onlineMediaUrl,
              signedUrl: response.data.meta.signedUrl,
            }}
          />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load script:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">
          스크립트를 불러오는데 실패했습니다.
        </h2>
        <p className="mt-2 text-gray-600">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }
}
