// Priority Scoring Algorithm
// Calculates a priority score for issues based on multiple factors

export interface PriorityScore {
    score: number; // 0-100
    rank: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: {
        upvotes: number;
        severity: number;
        age: number;
        location: number;
    };
}

/**
 * Calculate priority score for an issue
 */
export function calculatePriorityScore(issue: {
    upvote_count: number;
    created_at: string;
    category: string;
    latitude?: number;
    longitude?: number;
    status: string;
}): PriorityScore {
    let score = 0;
    const factors = {
        upvotes: 0,
        severity: 0,
        age: 0,
        location: 0,
    };

    // 1. Upvote Factor (0-40 points)
    // More upvotes = higher priority
    const upvoteScore = Math.min(40, (issue.upvote_count / 50) * 40);
    factors.upvotes = upvoteScore;
    score += upvoteScore;

    // 2. Severity Factor (0-30 points)
    // Based on category - some issues are more critical
    const severityMap: Record<string, number> = {
        Water: 30, // Water issues are critical
        Electricity: 25, // Power issues are important
        Roads: 20, // Road safety matters
        Garbage: 15, // Sanitation is important
        Other: 10,
    };
    const severityScore = severityMap[issue.category] || 10;
    factors.severity = severityScore;
    score += severityScore;

    // 3. Age Factor (0-20 points)
    // Older unresolved issues get higher priority
    const ageInDays = (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24);
    const ageScore = Math.min(20, (ageInDays / 30) * 20); // Max score at 30 days
    factors.age = ageScore;
    score += ageScore;

    // 4. Location Factor (0-10 points)
    // High-traffic areas get slight boost
    // For MVP, we'll use a simple heuristic
    // In production, you'd have a database of high-traffic coordinates
    const locationScore = 5; // Default medium priority
    factors.location = locationScore;
    score += locationScore;

    // Determine rank
    let rank: 'Low' | 'Medium' | 'High' | 'Critical';
    if (score >= 75) rank = 'Critical';
    else if (score >= 50) rank = 'High';
    else if (score >= 25) rank = 'Medium';
    else rank = 'Low';

    return {
        score: Math.round(score),
        rank,
        factors,
    };
}

/**
 * Sort issues by priority score
 */
export function sortByPriority(issues: any[]): any[] {
    return issues
        .map(issue => ({
            ...issue,
            priorityScore: calculatePriorityScore(issue),
        }))
        .sort((a, b) => b.priorityScore.score - a.priorityScore.score);
}

/**
 * Get priority color for UI
 */
export function getPriorityColor(rank: string): string {
    switch (rank) {
        case 'Critical':
            return '#DC2626'; // Red
        case 'High':
            return '#F59E0B'; // Orange
        case 'Medium':
            return '#3B82F6'; // Blue
        case 'Low':
            return '#10B981'; // Green
        default:
            return '#6B7280'; // Gray
    }
}
