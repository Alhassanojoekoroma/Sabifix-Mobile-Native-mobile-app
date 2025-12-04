// AI Categorization Service
// This service uses OpenAI to automatically categorize issues from images and descriptions

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

export type IssueCategory = 'Roads' | 'Water' | 'Electricity' | 'Garbage' | 'Other';

export interface CategorySuggestion {
    category: IssueCategory;
    confidence: number;
    suggestedTitle?: string;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

/**
 * Analyzes an image and description to suggest an issue category
 * For MVP, we'll use a simple rule-based system
 * In production, this would call OpenAI Vision API
 */
export async function categorizeIssue(
    imageUri: string | null,
    description: string
): Promise<CategorySuggestion> {
    // Simple keyword-based categorization for MVP
    // In production, replace with OpenAI API call

    const lowerDesc = description.toLowerCase();

    // Roads keywords
    if (lowerDesc.match(/pothole|road|street|pavement|asphalt|crack|bump/)) {
        return {
            category: 'Roads',
            confidence: 0.85,
            severity: lowerDesc.includes('large') || lowerDesc.includes('deep') ? 'High' : 'Medium',
            suggestedTitle: 'Road Issue Detected'
        };
    }

    // Water keywords
    if (lowerDesc.match(/water|pipe|leak|burst|flood|drain|sewer/)) {
        return {
            category: 'Water',
            confidence: 0.85,
            severity: lowerDesc.includes('burst') || lowerDesc.includes('flood') ? 'Critical' : 'High',
            suggestedTitle: 'Water Infrastructure Issue'
        };
    }

    // Electricity keywords
    if (lowerDesc.match(/light|electric|power|wire|pole|street light|lamp/)) {
        return {
            category: 'Electricity',
            confidence: 0.80,
            severity: lowerDesc.includes('down') || lowerDesc.includes('broken') ? 'High' : 'Medium',
            suggestedTitle: 'Electrical Issue'
        };
    }

    // Garbage keywords
    if (lowerDesc.match(/garbage|trash|waste|dump|litter|rubbish/)) {
        return {
            category: 'Garbage',
            confidence: 0.80,
            severity: lowerDesc.includes('pile') || lowerDesc.includes('overflow') ? 'Medium' : 'Low',
            suggestedTitle: 'Waste Management Issue'
        };
    }

    // Default
    return {
        category: 'Other',
        confidence: 0.50,
        severity: 'Medium',
        suggestedTitle: 'Community Issue'
    };
}

/**
 * Production version using OpenAI Vision API
 * Uncomment and use this when you have an OpenAI API key
 */
/*
export async function categorizeIssueWithAI(
  imageUri: string,
  description: string
): Promise<CategorySuggestion> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this image and description to categorize a community infrastructure issue. 
                Description: "${description}"
                
                Respond with JSON only:
                {
                  "category": "Roads" | "Water" | "Electricity" | "Garbage" | "Other",
                  "confidence": 0-1,
                  "severity": "Low" | "Medium" | "High" | "Critical",
                  "suggestedTitle": "brief title"
                }`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUri
                }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('AI categorization error:', error);
    // Fallback to keyword-based
    return categorizeIssue(imageUri, description);
  }
}
*/
