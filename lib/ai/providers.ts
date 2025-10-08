import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { groq } from '@ai-sdk/groq';
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
        'chat-model': gateway.languageModel('groq/compound'),
        'chat-model-reasoning': wrapLanguageModel({
          model: gateway.languageModel('groq/compound'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),

        'chat-model': groq.languageModel('groq/compound'),
        'chat-model-reasoning': wrapLanguageModel({
          model: groq.languageModel('groq/compound'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': gateway.languageModel('xai/grok-2-1212'),
        'artifact-model': gateway.languageModel('xai/grok-2-1212'),
      },
    });
