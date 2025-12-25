# AI Configuration Guide

## Required Environment Variables

To enable AI functionality in the Mayday AI web app, you need to configure API keys for Groq and/or DeepSeek.

### Required Variables

#### 1. Groq API Key (Required for default models)
```bash
GROQ_API_KEY=your_groq_api_key_here
```

**How to get a Groq API key:**
1. Visit https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

#### 2. DeepSeek API Key (Optional - for DeepSeek models)
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

**How to get a DeepSeek API key:**
1. Visit https://platform.deepseek.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

### Optional Variables

#### Web Search (for AI Agent features)
```bash
SEARCHAPI_KEY=your_searchapi_key_here
```

## Configuration

### Local Development

1. Create a `.env.local` file in the project root:
```bash
GROQ_API_KEY=your_groq_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here  # Optional
SEARCHAPI_KEY=your_searchapi_key_here  # Optional
```

2. Restart your development server:
```bash
pnpm dev
```

### Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `GROQ_API_KEY` - Your Groq API key (Required)
   - `DEEPSEEK_API_KEY` - Your DeepSeek API key (Optional)
   - `SEARCHAPI_KEY` - Your SearchAPI key (Optional)

4. Redeploy your application

## Available Models

### Groq Models (Default)
- **chat-model**: Groq Llama 3.1 8B Instant (default)
- **chat-model-reasoning**: Groq Llama 3.1 8B with reasoning
- **title-model**: Groq Llama 3.1 8B for titles
- **artifact-model**: Groq Llama 3.1 8B for artifacts

### DeepSeek Models (If DEEPSEEK_API_KEY is set)
- **deepseek-chat**: DeepSeek Chat model
- **deepseek-coder**: DeepSeek Coder model

## Troubleshooting

### AI Not Working

1. **Check API Keys**: Ensure `GROQ_API_KEY` is set correctly
2. **Check Environment Variables**: Verify variables are loaded:
   ```bash
   # In your code, you can check:
   console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Set' : 'Missing');
   ```
3. **Check API Quota**: Ensure your Groq/DeepSeek account has available credits
4. **Check Network**: Verify your deployment can reach Groq/DeepSeek APIs

### Common Errors

#### "Missing API key"
- **Solution**: Add `GROQ_API_KEY` to your environment variables

#### "Rate limit exceeded"
- **Solution**: Check your API quota and wait before retrying

#### "Model not found"
- **Solution**: Ensure you're using a valid model ID from the available models list

## Testing

After setting up your API keys, test the AI functionality:

1. Start the development server: `pnpm dev`
2. Open the chat interface
3. Send a test message
4. Verify you receive an AI response

If you see errors in the console, check:
- API key is correctly set
- API key has proper permissions
- Network connectivity to Groq/DeepSeek APIs
