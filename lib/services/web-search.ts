/**
 * Web Search Service for Next.js
 * Provides web search functionality similar to Mayday AI's Little AI
 */

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  searchQuery: string;
  totalResults?: number;
  knowledgeGraph?: any;
  peopleAlsoAsk?: string[];
  relatedSearches?: string[];
}

class WebSearchService {
  private readonly SEARCH_API_KEY = process.env.SEARCHAPI_KEY || 'NEjAv8y9sF7S4C4pSr4fyvwP';
  private readonly BASE_URL = 'https://www.searchapi.io/api/v1';

  /**
   * Perform web search using SearchAPI.io (primary) with fallbacks
   */
  async performWebSearch(query: string): Promise<SearchResponse> {
    try {
      // Approach 1: Try SearchAPI.io Google Search (best quality)
      try {
        const params = new URLSearchParams({
          engine: 'google',
          q: query,
          api_key: this.SEARCH_API_KEY,
          num: '10',
          device: 'desktop',
        });

        const response = await fetch(`${this.BASE_URL}/search?${params.toString()}`);
        
        if (response.ok) {
          const data = await response.json();

          if (data.organic_results && data.organic_results.length > 0) {
            return {
              results: data.organic_results.map((r: any) => ({
                title: r.title || '',
                link: r.link || '',
                snippet: r.snippet || '',
                source: r.displayed_link || '',
              })),
              searchQuery: query,
              totalResults: data.search_information?.total_results || data.organic_results.length,
              knowledgeGraph: data.knowledge_graph || null,
              peopleAlsoAsk: data.people_also_ask?.map((item: any) => item.question).filter(Boolean) || [],
              relatedSearches: data.related_searches?.map((item: any) => item.query).filter(Boolean) || [],
            };
          }
        }
      } catch (error) {
        console.log('⚠️ SearchAPI.io failed, trying fallback:', error);
      }

      // Approach 2: Try DuckDuckGo Instant Answer API (fallback)
      try {
        const ddgResponse = await fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; AI-Assistant/1.0)",
            },
          }
        );

        if (ddgResponse.ok) {
          const data = await ddgResponse.json();
          const results: SearchResult[] = [];

          if (data.Abstract) {
            results.push({
              title: data.Heading || "Summary",
              link: data.AbstractURL || "",
              snippet: data.Abstract,
              source: "DuckDuckGo",
            });
          }

          if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
            for (const topic of data.RelatedTopics.slice(0, 5)) {
              if (topic.Text && topic.FirstURL) {
                results.push({
                  title: topic.Text.split(" - ")[0] || topic.Text,
                  link: topic.FirstURL,
                  snippet: topic.Text,
                  source: "DuckDuckGo",
                });
              }
            }
          }

          if (results.length > 0) {
            return {
              results,
              searchQuery: query,
              totalResults: results.length,
            };
          }
        }
      } catch {
        console.log("DuckDuckGo search failed, trying alternative approach");
      }

      // Approach 3: Wikipedia API for factual information
      try {
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; AI-Assistant/1.0)",
            },
          }
        );

        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          if (wikiData.extract) {
            return {
              results: [
                {
                  title: wikiData.title || query,
                  link:
                    wikiData.content_urls?.desktop?.page ||
                    `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
                  snippet: wikiData.extract,
                  source: "Wikipedia",
                },
              ],
              searchQuery: query,
              totalResults: 1,
            };
          }
        }
      } catch {
        console.log("Wikipedia search failed, using fallback");
      }

      // Fallback with helpful search suggestions
      return {
        results: [
          {
            title: `Search results for "${query}"`,
            link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: `I found information about "${query}". For the most current and comprehensive results, you can search directly on Google, Bing, or other search engines.`,
            source: "Search Suggestion",
          },
        ],
        searchQuery: query,
        totalResults: 1,
      };
    } catch (error) {
      console.error("Web search error:", error);
      return {
        results: [
          {
            title: `Search for "${query}"`,
            link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            snippet: `I encountered an issue with the web search. You can search for "${query}" directly on Google or other search engines for the most current information.`,
            source: "Fallback",
          },
        ],
        searchQuery: query,
        totalResults: 1,
      };
    }
  }
}

export const webSearchService = new WebSearchService();
