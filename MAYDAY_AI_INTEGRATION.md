# Mayday AI Integration - Web App

This Next.js web application integrates Mayday AI's core features and functionality, making it available as a web application deployable on Vercel.

## 🚀 Features Integrated

### 1. **AI Agent with Web Search**
- Automatic web search detection based on query patterns
- Real-time web search integration using SearchAPI.io
- Enhanced AI responses with web search context
- Source citations and knowledge graphs

### 2. **Enhanced AI Capabilities**
- Improved system prompts for better responses
- Context-aware AI responses
- Multi-source information synthesis
- Natural language understanding

### 3. **Web Search Service**
- SearchAPI.io integration (primary)
- DuckDuckGo fallback
- Wikipedia integration
- Knowledge graph extraction
- People Also Ask support

## 📁 Project Structure

```
nextjs-ai/
├── lib/
│   └── services/
│       ├── web-search.ts      # Web search service
│       └── ai-agent.ts        # AI agent service
├── app/
│   └── (chat)/
│       └── api/
│           └── chat/
│               └── route.ts   # Enhanced chat route with web search
└── MAYDAY_AI_INTEGRATION.md   # This file
```

## 🔧 Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
# Web Search (SearchAPI.io)
SEARCHAPI_KEY="your-searchapi-key-here"

# Optional: Get a free key from https://www.searchapi.io/
# Or use the default key (limited requests)
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

## 🌐 Vercel Deployment

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `SEARCHAPI_KEY` - Your SearchAPI.io API key

### 2. Environment Variables for Vercel

In your Vercel project settings, add:

- `SEARCHAPI_KEY` - SearchAPI.io API key (required for web search)

### 3. Deploy

Vercel will automatically deploy your application. The web search and AI agent features will work automatically.

## 🎯 How It Works

### Web Search Integration

1. **Query Analysis**: The AI agent analyzes user queries to determine if web search is needed
2. **Automatic Search**: If needed, performs web search using SearchAPI.io
3. **Context Enhancement**: Adds web search results to AI prompt
4. **Enhanced Response**: AI generates response with real-time information

### Query Detection

The AI agent automatically detects queries that need web search:

- **Factual Questions**: "What is...", "Who is...", "When did..."
- **Time-Sensitive**: "Current", "Latest", "Recent", "Today"
- **Comparisons**: "Best", "Top", "Compare", "vs"
- **Explanations**: "Tell me about...", "Explain..."

### Example Queries

```
"What is artificial intelligence?"
"Latest news about React"
"Best programming languages in 2024"
"Compare Python vs JavaScript"
```

## 📊 API Routes

### Chat API (Enhanced)

The chat API route (`/api/chat`) now includes:

- Automatic web search detection
- Web search context injection
- Enhanced system prompts
- Source citations

## 🔍 Web Search Service

### Features

- **SearchAPI.io**: Primary search engine (high quality)
- **DuckDuckGo**: Fallback option
- **Wikipedia**: Factual information fallback
- **Knowledge Graphs**: Structured data extraction
- **People Also Ask**: Related questions

### Usage

```typescript
import { webSearchService } from '@/lib/services/web-search';

const results = await webSearchService.performWebSearch('query');
```

## 🤖 AI Agent Service

### Features

- **Smart Query Detection**: Determines if web search is needed
- **Context Formatting**: Formats web search results for AI
- **Enhanced Prompts**: Better system prompts for AI
- **Source Management**: Handles search sources and citations

### Usage

```typescript
import { aiAgentService } from '@/lib/services/ai-agent';

// Check if web search is needed
const needsSearch = aiAgentService.shouldUseWebSearch('query');

// Perform web search
const context = await aiAgentService.performWebSearch('query');

// Format for AI prompt
const formatted = aiAgentService.formatWebSearchContext(context);
```

## 🎨 Customization

### Customizing Web Search

Edit `lib/services/web-search.ts` to:
- Change search providers
- Modify result formatting
- Add custom search logic

### Customizing AI Agent

Edit `lib/services/ai-agent.ts` to:
- Adjust query detection patterns
- Modify context formatting
- Change system prompts

## 📝 Notes

### SearchAPI.io

- Free tier available with limited requests
- Get API key from: https://www.searchapi.io/
- Default key provided (limited usage)

### Fallback Behavior

If SearchAPI.io fails, the service automatically falls back to:
1. DuckDuckGo Instant Answer API
2. Wikipedia API
3. Search suggestion with Google link

## 🐛 Troubleshooting

### Web Search Not Working

1. Check `SEARCHAPI_KEY` environment variable
2. Verify API key is valid
3. Check network connectivity
4. Review console logs for errors

### AI Responses Not Enhanced

1. Verify web search is being triggered
2. Check query patterns match detection rules
3. Review system prompt enhancement
4. Check AI model configuration

## 🚀 Next Steps

### Potential Enhancements

1. **Voice Assistant**: Add voice input/output (web speech API)
2. **More Search Providers**: Add Bing, Google Custom Search
3. **Caching**: Cache search results for common queries
4. **Analytics**: Track search usage and performance
5. **User Preferences**: Allow users to enable/disable web search

## 📚 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [AI SDK Documentation](https://ai-sdk.dev)
- [SearchAPI.io Documentation](https://www.searchapi.io/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

## ✅ Success Indicators

- ✅ Web search automatically triggers for relevant queries
- ✅ AI responses include real-time information
- ✅ Sources are cited in responses
- ✅ Knowledge graphs are extracted
- ✅ Fallback mechanisms work
- ✅ Vercel deployment successful

Your Mayday AI web app is now ready! 🎉
