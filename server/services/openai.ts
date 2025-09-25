import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "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"
});

// Using GPT-4o which is the latest available OpenAI model
const MODEL = "gpt-3.5-turbo";

export async function summarizeText(text: string): Promise<string> {
  try {
    // Check if we have a valid API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "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") {
      // For MVP demo purposes, provide a mock summary
      return `This is a demo summary of the provided text. The main points include: ${text.slice(0, 50)}... (Note: This is a demo response as OpenAI API key is not configured)`;
    }

    const prompt = `Please provide a concise summary of the following text, highlighting the key points and main ideas:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500
    });

    return response.choices[0].message.content || "Unable to generate summary";
  } catch (error: any) {
    console.error("Error summarizing text:", error);
    
    // Fallback to demo mode if OpenAI fails
    return `Demo Summary: The text discusses key concepts including technology trends and current developments. This is a fallback response as the AI service is temporarily unavailable. Main topic: ${text.slice(0, 100)}...`;
  }
}

export async function detectFakeNews(text: string): Promise<{
  isReal: boolean;
  confidence: number;
  reasoning: string;
}> {
  try {
    // Simple rule-based check for trusted sources first
    const trustedSources = ['thanthi', 'polimer', 'suntv', 'bbc', 'reuters', 'ap news'];
    const lowerText = text.toLowerCase();
    
    for (const source of trustedSources) {
      if (lowerText.includes(source)) {
        return {
          isReal: true,
          confidence: 0.95,
          reasoning: `Content appears to be from a trusted source: ${source}`
        };
      }
    }

    // Check if we have a valid API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "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") {
      // Provide rule-based analysis for demo
      const suspiciousWords = ['breaking', 'exclusive', 'shocking', 'unbelievable'];
      const hasSuspicious = suspiciousWords.some(word => lowerText.includes(word));
      
      return {
        isReal: !hasSuspicious,
        confidence: 0.7,
        reasoning: `Demo Analysis: Content ${hasSuspicious ? 'contains sensational language' : 'appears measured'}. This is a rule-based analysis as AI verification is not configured.`
      };
    }

    const prompt = `Analyze the following text for potential misinformation or fake news. Consider factors like:
    - Factual accuracy
    - Source credibility
    - Emotional language vs factual reporting
    - Consistency with known facts
    - Presence of verifiable information
    
    Respond with JSON in this format: {
      "isReal": boolean,
      "confidence": number (0-1),
      "reasoning": "detailed explanation"
    }
    
    Text: ${text}`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert fact-checker and misinformation analyst. Analyze content objectively and provide detailed reasoning."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      isReal: result.isReal || false,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      reasoning: result.reasoning || "Unable to analyze content"
    };
  } catch (error) {
    console.error("Error detecting fake news:", error);
    
    // Fallback analysis
    const suspiciousWords = ['breaking', 'exclusive', 'shocking', 'unbelievable'];
    const hasSuspicious = suspiciousWords.some(word => text.toLowerCase().includes(word));
    
    return {
      isReal: !hasSuspicious,
      confidence: 0.6,
      reasoning: `Fallback Analysis: Content ${hasSuspicious ? 'contains sensational language which may indicate misinformation' : 'appears to use measured language'}. AI analysis is temporarily unavailable.`
    };
  }
}

export async function chatWithAI(message: string, context?: string): Promise<string> {
  try {
    // Check if we have a valid API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "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") {
      // Provide basic responses for common queries
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('news') || lowerMessage.includes('headline')) {
        return "I'm a demo AI assistant for FlashPress News. I can help you understand news articles and current events. For the latest headlines, please check our main news feed on the homepage. (Note: Full AI features require API key configuration)";
      } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
        return "I can help summarize articles for you! Please use our Article Summarizer tool from the navigation menu. Just paste your article text there and I'll provide a concise summary.";
      } else {
        return "Hello! I'm the FlashPress News AI assistant. I'm currently running in demo mode. I can help you navigate the site and understand how our AI features work. Try asking me about news summaries or fake news detection!";
      }
    }

    let prompt = message;
    
    if (context) {
      prompt = `Context: ${context}\n\nUser question: ${message}`;
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are a helpful news assistant. You can summarize articles, provide news insights, answer questions about current events, and help users understand complex topics. Be concise, accurate, and helpful."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 800
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your request.";
  } catch (error) {
    console.error("Error in AI chat:", error);
    
    // Fallback response
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('news') || lowerMessage.includes('headline')) {
      return "I'm experiencing some technical difficulties, but I'd be happy to help! For the latest news, please check our homepage. Our news feed is updated regularly with articles from trusted sources.";
    } else if (lowerMessage.includes('summary')) {
      return "I'm having trouble accessing my full capabilities right now, but you can use our Article Summarizer tool to get concise summaries of any text or article.";
    } else {
      return "I'm currently experiencing some technical issues, but I'm still here to help! Please try asking me about news topics, summaries, or navigation around the site.";
    }
  }
}
