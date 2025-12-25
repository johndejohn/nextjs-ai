export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Groq Llama 3.1 8B',
    description: 'Fast and efficient model powered by Groq (default)',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Groq Llama 3.1 8B (Reasoning)',
    description: 'Groq model with enhanced reasoning capabilities',
  },
  ...(process.env.DEEPSEEK_API_KEY ? [
    {
      id: 'deepseek-chat',
      name: 'DeepSeek Chat',
      description: 'Advanced conversational AI by DeepSeek',
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      description: 'Specialized coding assistant by DeepSeek',
    },
  ] : []),
];
