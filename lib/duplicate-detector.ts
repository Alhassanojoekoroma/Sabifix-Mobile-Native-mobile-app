// Duplicate Issue Detection Service
// Detects if a new issue is similar to existing issues

export interface DuplicateMatch {
    issueId: string;
    similarity: number;
    reason: string;
}

/**
 * Calculate distance between two coordinates in meters
 */
function getDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Calculate text similarity using simple word overlap
 * In production, use embeddings or Levenshtein distance
 */
function calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
}

/**
 * Detect if a new issue is a duplicate of existing issues
 */
export async function detectDuplicates(
    newIssue: {
        title: string;
        description: string;
        category: string;
        latitude: number;
        longitude: number;
    },
    existingIssues: Array<{
        id: string;
        title: string;
        description: string;
        category: string;
        latitude: number;
        longitude: number;
        status: string;
    }>
): Promise<DuplicateMatch[]> {
    const duplicates: DuplicateMatch[] = [];
    const DISTANCE_THRESHOLD = 50; // 50 meters
    const TEXT_SIMILARITY_THRESHOLD = 0.6;

    for (const existing of existingIssues) {
        // Skip resolved issues
        if (existing.status === 'Resolved') continue;

        // Check if same category
        if (existing.category !== newIssue.category) continue;

        // Calculate distance
        const distance = getDistanceInMeters(
            newIssue.latitude,
            newIssue.longitude,
            existing.latitude,
            existing.longitude
        );

        // Check location proximity
        if (distance <= DISTANCE_THRESHOLD) {
            // Calculate text similarity
            const titleSimilarity = calculateTextSimilarity(
                newIssue.title,
                existing.title
            );
            const descSimilarity = calculateTextSimilarity(
                newIssue.description || '',
                existing.description || ''
            );
            const textSimilarity = (titleSimilarity + descSimilarity) / 2;

            if (textSimilarity >= TEXT_SIMILARITY_THRESHOLD || distance <= 20) {
                const similarity = Math.max(
                    textSimilarity,
                    1 - distance / DISTANCE_THRESHOLD
                );

                duplicates.push({
                    issueId: existing.id,
                    similarity,
                    reason:
                        distance <= 20
                            ? `Very close location (${Math.round(distance)}m away)`
                            : `Similar issue nearby (${Math.round(distance)}m away, ${Math.round(textSimilarity * 100)}% similar)`,
                });
            }
        }
    }

    // Sort by similarity (highest first)
    return duplicates.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Check if we should warn user about potential duplicate
 */
export function shouldWarnDuplicate(duplicates: DuplicateMatch[]): boolean {
    return duplicates.length > 0 && duplicates[0].similarity > 0.7;
}
