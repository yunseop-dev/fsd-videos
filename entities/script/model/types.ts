// src/entities/script/model/types.ts
export interface ScriptMeta {
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
  onlineMediaUrl: string;
  signedUrl: string;
}

export interface ScriptResponse {
  item: string; // base64 encoded string
  meta: ScriptMeta;
}

export interface DecodedScript {
  // 디코딩된 스크립트의 타입을 정의합니다.
  // base64 디코딩 후 실제 데이터 구조에 맞춰 타입을 확장하세요
  content: string;
  timestamp?: string;
  speaker?: string;
}

export interface ParsedScript {
  editorState: EditorState;
  lastSaved: number;
  source: string;
  version: string;
}

interface EditorState {
  root: Root;
}

interface Root {
  children: Paragraph[];
  type: string;
  version: number;
}

interface Paragraph {
  children: ChildNode[];
  type: string;
}

interface ChildNode {
  speaker?: string;
  time?: number;
  type: string;
  text?: string;
  s?: number;
  e?: number;
}
