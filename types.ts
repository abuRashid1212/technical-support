
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  content: string;
  uploadDate: number;
}

export interface BotSettings {
  bubbleColor: string;
  icon: string;
}

export type AppView = 'chat' | 'admin' | 'login';
