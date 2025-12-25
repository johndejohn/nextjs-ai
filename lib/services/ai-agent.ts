/**
 * AI Agent Service for Next.js
 * Combines AI chat with web search capabilities
 * Similar to Mayday AI's AI Agent Service
 */

import { webSearchService, type SearchResponse } from './web-search';

export interface WebSearchContext {
  searchQuery: string;
  answer: string;
  sources: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
  knowledgeGraph?: {
    title: string;
    description: string;
    attributes?: Array<{ label: string; value: string }>;
  };
  featuredSnippet?: {
    text: string;
    source: { title: string; link: string };
  };
  peopleAlsoAsk?: string[];
  confidence: number;
}

class AiAgentService {
  private readonly WEB_SEARCH_KEYWORDS = [
    'what is', 'who is', 'when did', 'where is', 'how to', 'why does',
    'current', 'latest', 'recent', 'news', 'today', 'now', '2024', '2025',
    'price', 'cost', 'compare', 'best', 'top', 'review', 'rating',
    'definition', 'meaning', 'explain', 'tell me about'
  ];

  private readonly NO_SEARCH_KEYWORDS = [
    'hello', 'hi', 'hey', 'thanks', 'thank you', 'please', 'help',
    'calculate', 'math', 'solve', 'code', 'write', 'create', 'generate'
  ];

  /**
   * Determine if web search would be helpful for this question
   */
  shouldUseWebSearch(question: string): boolean {
    const lowerQuestion = question.toLowerCase().trim();
    
    // Check for explicit no-search keywords
    if (this.NO_SEARCH_KEYWORDS.some(keyword => lowerQuestion.includes(keyword))) {
      return false;
    }

    // Check for web search keywords
    const hasSearchKeywords = this.WEB_SEARCH_KEYWORDS.some(keyword => 
      lowerQuestion.includes(keyword)
    );

    // Check question length (longer questions might need search)
    const isLongQuestion = question.length > 50;

    // Check if it's a factual question
    const isFactualQuestion = /^(what|who|when|where|how|why|which|can|is|are|do|does|did)\s/i.test(question);

    // Check if question contains time-sensitive terms
    const isTimeSensitive = /(current|latest|recent|today|now|new|2024|2025)/i.test(question);

    // Check if question asks for comparison or recommendations
    const isComparison = /(compare|best|top|better|vs|versus|recommend|suggest)/i.test(question);

    // If it's a simple greeting or short question without search keywords, skip search
    if (!hasSearchKeywords && !isLongQuestion && !isFactualQuestion && !isTimeSensitive && !isComparison) {
      return false;
    }

    // Use web search if:
    // 1. Has search keywords, OR
    // 2. Is a factual question, OR
    // 3. Is time-sensitive, OR
    // 4. Asks for comparison/recommendations
    return hasSearchKeywords || isFactualQuestion || isTimeSensitive || isComparison;
  }

  /**
   * Perform web search and format context
   */
  async performWebSearch(question: string): Promise<WebSearchContext | null> {
    try {
      console.log('⚡ AI Agent: Fast web search for:', question);
      
      const searchResponse = await webSearchService.performWebSearch(question);
      
      if (!searchResponse.results || searchResponse.results.length === 0) {
        return null;
      }

      // Generate a summary answer from search results
      const answer = this.generateAnswerFromSearch(searchResponse);

      const webSearchContext: WebSearchContext = {
        searchQuery: searchResponse.searchQuery,
        answer,
        sources: searchResponse.results.map(source => ({
          title: source.title,
          link: source.link,
          snippet: source.snippet,
        })),
        knowledgeGraph: searchResponse.knowledgeGraph,
        peopleAlsoAsk: searchResponse.peopleAlsoAsk,
        confidence: 0.85,
      };

      console.log('⚡ AI Agent: Fast web search completed with', webSearchContext.sources.length, 'sources');
      return webSearchContext;
    } catch (error) {
      console.error('❌ AI Agent: Web search error:', error);
      return null;
    }
  }

  /**
   * Generate answer summary from search results
   */
  private generateAnswerFromSearch(searchResponse: SearchResponse): string {
    if (searchResponse.knowledgeGraph?.description) {
      return searchResponse.knowledgeGraph.description;
    }

    if (searchResponse.results.length > 0) {
      // Combine top 3 results
      const topResults = searchResponse.results.slice(0, 3);
      return topResults.map(r => r.snippet).join(' ').substring(0, 500);
    }

    return `I found information about "${searchResponse.searchQuery}". Please see the sources below for detailed information.`;
  }

  /**
   * Format web search context for AI prompt
   */
  formatWebSearchContext(webSearch: WebSearchContext): string {
    let context = '\n\n[WEB SEARCH RESULTS - Use this information to enhance your answer]\n';
    context += `Search Query: ${webSearch.searchQuery}\n`;
    context += `Confidence: ${Math.round(webSearch.confidence * 100)}%\n\n`;

    // Add knowledge graph if available
    if (webSearch.knowledgeGraph) {
      context += `Knowledge Graph:\n`;
      context += `Title: ${webSearch.knowledgeGraph.title}\n`;
      context += `Description: ${webSearch.knowledgeGraph.description}\n`;
      if (webSearch.knowledgeGraph.attributes) {
        context += `Attributes:\n`;
        webSearch.knowledgeGraph.attributes.forEach(attr => {
          context += `  - ${attr.label}: ${attr.value}\n`;
        });
      }
      context += '\n';
    }

    // Add web search answer summary
    context += `Web Search Summary:\n${webSearch.answer}\n\n`;

    // Add sources
    context += `Sources (${webSearch.sources.length}):\n`;
    webSearch.sources.slice(0, 5).forEach((source, index) => {
      context += `${index + 1}. ${source.title}\n`;
      context += `   ${source.snippet}\n`;
      context += `   ${source.link}\n\n`;
    });

    // Add "People Also Ask" if available
    if (webSearch.peopleAlsoAsk && webSearch.peopleAlsoAsk.length > 0) {
      context += `Related Questions:\n`;
      webSearch.peopleAlsoAsk.slice(0, 3).forEach((q, index) => {
        context += `  ${index + 1}. ${q}\n`;
      });
      context += '\n';
    }

    context += '[END WEB SEARCH RESULTS]\n';
    context += 'INSTRUCTIONS: You are an advanced AI assistant with access to real-time web search results. ';
    context += 'Your task is to synthesize the web search information with your knowledge to provide: ';
    context += '1) A comprehensive, accurate, and up-to-date answer, 2) Clear citations to sources when appropriate, ';
    context += '3) A natural, conversational tone, 4) Additional context or related information when helpful. ';
    context += 'Be thorough but concise. Prioritize accuracy and cite sources. If information conflicts, mention it.';
    
    return context;
  }

  /**
   * Enhanced system prompt for better AI responses
   */
  getEnhancedSystemPrompt(): string {
    let prompt = 'You are Mayday AI, an advanced AI assistant with the following capabilities:\n\n';
    prompt += '1. **Intelligence**: You have access to real-time web search and can provide up-to-date information.\n';
    prompt += '2. **Context Awareness**: You remember previous conversations and user preferences.\n';
    prompt += '3. **Natural Language**: You communicate naturally and conversationally.\n';
    prompt += '4. **Accuracy**: You prioritize accuracy and cite sources when using web search results.\n';
    prompt += '5. **Helpfulness**: You provide comprehensive, detailed answers when appropriate.\n';
    prompt += '6. **Adaptability**: You adjust your response style based on the question complexity.\n\n';
    
    prompt += 'GUIDELINES:\n';
    prompt += '- Be concise for simple questions, detailed for complex topics\n';
    prompt += '- Use web search results to enhance answers with current information\n';
    prompt += '- Cite sources when referencing web search results\n';
    prompt += '- Maintain a friendly, professional tone\n';
    prompt += '- If uncertain, acknowledge it and provide the best available information\n';
    prompt += '- For technical topics, provide both simple explanations and technical details when appropriate\n';
    
    return prompt;
  }
}

export const aiAgentService = new AiAgentService();
