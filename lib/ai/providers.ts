import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';

// Initialize Groq provider
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize OpenAI provider (for DeepSeek models via OpenAI-compatible API)
const openai = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com/v1' 
    : undefined,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require('./models.mock');
      return customProvider({
        languageModels: {
          'chat-model': chatModel,
          'chat-model-reasoning': reasoningModel,
          'title-model': titleModel,
          'artifact-model': artifactModel,
        },
      });
    })()
  : (() => {
      const languageModels: Record<string, any> = {};
      
      // Groq models (if API key is provided)
      if (process.env.GROQ_API_KEY) {
        const groqModel = groq('llama-3.1-8b-instant');
        languageModels['chat-model'] = groqModel;
        languageModels['chat-model-reasoning'] = groqModel; // Simplified - reasoning handled in prompts
        languageModels['title-model'] = groqModel;
        languageModels['artifact-model'] = groqModel;
      }
      
      // DeepSeek models (if API key is provided)
      if (process.env.DEEPSEEK_API_KEY) {
        languageModels['deepseek-chat'] = openai('deepseek-chat');
        languageModels['deepseek-coder'] = openai('deepseek-coder');
      }
      
      // Fallback: if no API keys, use Groq with undefined key (will error at runtime)
      if (Object.keys(languageModels).length === 0) {
        console.warn('⚠️ No AI API keys found. Please set GROQ_API_KEY or DEEPSEEK_API_KEY');
        const groqModel = groq('llama-3.1-8b-instant');
        languageModels['chat-model'] = groqModel;
        languageModels['chat-model-reasoning'] = groqModel;
        languageModels['title-model'] = groqModel;
        languageModels['artifact-model'] = groqModel;
      }
      
      return customProvider({ languageModels });
    })();
