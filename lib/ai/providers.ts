import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { isTestEnvironment } from '../constants';

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
  : customProvider({
      languageModels: {
        'chat-model': gateway.languageModel('groq/llama-3.1-8b-instant'),
        'chat-model-reasoning': wrapLanguageModel({
          model: gateway.languageModel('groq/llama-3.1-8b-instant'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': gateway.languageModel('groq/llama-3.1-8b-instant'),
        'artifact-model': gateway.languageModel('groq/llama-3.1-8b-instant'),
      },
    });
