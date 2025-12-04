/**
 * Google AI Service for Auto-generation
 * Uses Google's Gemini API to generate issue descriptions and detect categories
 */

const GOOGLE_AI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_AI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeneratedIssueData {
    title: string;
    description: string;
    category: string;
}

/**
 * Generate issue description and category from an image
 * @param imageBase64 Base64 encoded image
 * @param userTitle Optional user-provided title
 * @returns Generated title, description, and category
 */
export async function generateIssueFromImage(
    imageBase64: string,
    userTitle?: string
): Promise<GeneratedIssueData> {
    try {
        const prompt = userTitle
            ? `Analyze this image of a community issue titled "${userTitle}". Generate:
1. A detailed description of the problem (2-3 sentences)
2. The most appropriate category from: Roads, Water, Electricity, Garbage, Drainage, Public Safety, Street Lighting, or Other

Format your response as JSON:
{
  "description": "detailed description here",
  "category": "category name"
}`
            : `Analyze this image of a community infrastructure problem. Generate:
1. A clear, concise title (max 10 words)
2. A detailed description of the problem (2-3 sentences)
3. The most appropriate category from: Roads, Water, Electricity, Garbage, Drainage, Public Safety, Street Lighting, or Other

Format your response as JSON:
{
  "title": "title here",
  "description": "detailed description here",
  "category": "category name"
}`;

        const response = await fetch(`${API_URL}?key=${GOOGLE_AI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                            {
                                inline_data: {
                                    mime_type: 'image/jpeg',
                                    data: imageBase64,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.4,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 500,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse AI response');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return {
            title: userTitle || parsed.title || 'Community Issue',
            description: parsed.description || '',
            category: normalizeCategory(parsed.category),
        };
    } catch (error) {
        console.error('AI generation error:', error);
        // Return fallback values
        return {
            title: userTitle || 'Community Issue',
            description: 'Please provide a description of the issue.',
            category: 'Other',
        };
    }
}

/**
 * Generate description from title and optional image
 */
export async function generateDescription(
    title: string,
    imageBase64?: string
): Promise<string> {
    try {
        const parts: any[] = [
            {
                text: `Based on this community issue title: "${title}", generate a detailed 2-3 sentence description of what the problem might be and its potential impact on the community.`,
            },
        ];

        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64,
                },
            });
        }

        const response = await fetch(`${API_URL}?key=${GOOGLE_AI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.6,
                    maxOutputTokens: 200,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error('Description generation error:', error);
        return 'Please provide a description of the issue.';
    }
}

/**
 * Detect category from title and optional image
 */
export async function detectCategory(
    title: string,
    imageBase64?: string
): Promise<string> {
    try {
        const parts: any[] = [
            {
                text: `Categorize this community issue: "${title}". 
Choose the MOST appropriate category from this list:
- Roads
- Water
- Electricity
- Garbage
- Drainage
- Public Safety
- Street Lighting
- Other

Respond with ONLY the category name, nothing else.`,
            },
        ];

        if (imageBase64) {
            parts.push({
                inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64,
                },
            });
        }

        const response = await fetch(`${API_URL}?key=${GOOGLE_AI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 50,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        const category = data.candidates[0].content.parts[0].text.trim();
        return normalizeCategory(category);
    } catch (error) {
        console.error('Category detection error:', error);
        return 'Other';
    }
}

/**
 * Normalize category to match our predefined list
 */
function normalizeCategory(category: string): string {
    const normalized = category.toLowerCase().trim();
    const categories = [
        'Roads',
        'Water',
        'Electricity',
        'Garbage',
        'Drainage',
        'Public Safety',
        'Street Lighting',
    ];

    for (const cat of categories) {
        if (normalized.includes(cat.toLowerCase())) {
            return cat;
        }
    }

    return 'Other';
}

/**
 * Convert image URI to base64
 */
export async function imageUriToBase64(uri: string): Promise<string> {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                // Remove data:image/jpeg;base64, prefix
                resolve(base64.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Image conversion error:', error);
        throw error;
    }
}
