export interface Board {
  id: string;
  name: string;
  isStarred: boolean;
  isShared: boolean;
  createTime: string;
  updateTime: string;
  deleteTime: null | string;
  folderId: string;
  folder: {
    id: string;
    name: string;
    type: string;
  };
  status: string;
  progress: number;
  fileMetaId: string;
}
