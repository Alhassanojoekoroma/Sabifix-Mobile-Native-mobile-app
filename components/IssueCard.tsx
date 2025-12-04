import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThumbsUp, MapPin } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { StatusBadge } from './StatusBadge';
import { useRouter } from 'expo-router';

interface IssueCardProps {
    issue: any;
    onUpvote: (id: string) => void;
    hasUpvoted: boolean;
    rank?: number;
}

export function IssueCard({ issue, onUpvote, hasUpvoted, rank }: IssueCardProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/issue/${issue.id}`)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: issue.image_url }} style={styles.image} resizeMode="cover" />
                {rank && (
                    <View style={styles.rankBadge}>
                        <Text style={styles.rankText}>#{rank}</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={2}>{issue.title}</Text>
                    <StatusBadge status={issue.status} />
                </View>

                <View style={styles.metaRow}>
                    <MapPin size={14} color={Colors.textLight} />
                    <Text style={styles.metaText} numberOfLines={1}>
                        {issue.location} • {issue.category}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.date}>
                        {new Date(issue.created_at).toLocaleDateString()}
                    </Text>

                    <TouchableOpacity
                        style={[styles.upvoteButton, hasUpvoted && styles.upvoteButtonActive]}
                        onPress={(e) => {
                            e.stopPropagation();
                            onUpvote(issue.id);
                        }}
                    >
                        <ThumbsUp
                            size={16}
                            color={hasUpvoted ? Colors.white : Colors.primary}
                            fill={hasUpvoted ? Colors.white : 'transparent'}
                        />
                        <Text style={[styles.upvoteCount, hasUpvoted && styles.upvoteCountActive]}>
                            {issue.upvote_count || 0}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        flexDirection: 'row',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.005,
        shadowRadius: 8,
        elevation: 1,
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    rankBadge: {
        position: 'absolute',
        top: 4,
        left: 4,
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rankText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    metaText: {
        fontSize: 13,
        color: Colors.textLight,
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    date: {
        fontSize: 12,
        color: Colors.textLight,
    },
    upvoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(49, 46, 255, 0.1)',
    },
    upvoteButtonActive: {
        backgroundColor: Colors.primary,
    },
    upvoteCount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    upvoteCountActive: {
        color: Colors.white,
    },
});
