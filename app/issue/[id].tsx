import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThumbsUp, MapPin, Calendar, User, TrendingUp, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { StatusBadge } from '../../components/StatusBadge';
import { Colors } from '../../constants/colors';
import SponsorshipCard from '../../components/SponsorshipCard';
import SponsorshipModal from '../../components/SponsorshipModal';

export default function IssueDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [issue, setIssue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [fundingData, setFundingData] = useState<any>(null);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [milestones, setMilestones] = useState<any[]>([]);

    useEffect(() => {
        fetchIssueData();
    }, [id]);

    const fetchIssueData = async () => {
        try {
            // Fetch issue
            const { data: issueData, error: issueError } = await supabase
                .from('issues')
                .select('*')
                .eq('id', id)
                .single();

            if (issueError) throw issueError;
            setIssue(issueData);

            // Check if user upvoted
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: upvoteData } = await supabase
                    .from('upvotes')
                    .select('*')
                    .eq('issue_id', id)
                    .eq('user_id', user.id)
                    .single();

                setHasUpvoted(!!upvoteData);
            }

            // Fetch funding data (will fail if migration not run, but that's ok)
            try {
                const { data: funding } = await supabase
                    .from('issue_funding')
                    .select('*')
                    .eq('issue_id', id)
                    .single();

                setFundingData(funding);
            } catch (e) {
                console.log('Funding data not available yet');
            }

            // Mock milestones (you can add a milestones table later)
            setMilestones([
                {
                    id: 1,
                    title: 'Issue Reported',
                    description: 'Community member reported the issue',
                    date: issueData.created_at,
                    completed: true,
                },
                {
                    id: 2,
                    title: 'Under Review',
                    description: 'Council is reviewing the issue',
                    date: null,
                    completed: issueData.status !== 'reported',
                },
                {
                    id: 3,
                    title: 'In Progress',
                    description: 'Work has started on fixing the issue',
                    date: null,
                    completed: issueData.status === 'in progress' || issueData.status === 'resolved',
                },
                {
                    id: 4,
                    title: 'Resolved',
                    description: 'Issue has been fixed',
                    date: null,
                    completed: issueData.status === 'resolved',
                },
            ]);
        } catch (error: any) {
            console.error('Error fetching issue:', error);
            Alert.alert('Error', 'Failed to load issue details');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Login Required', 'Please login to upvote');
                return;
            }

            if (hasUpvoted) {
                await supabase.from('upvotes').delete().eq('issue_id', id).eq('user_id', user.id);
                await supabase.from('issues').update({ upvote_count: issue.upvote_count - 1 }).eq('id', id);
                setIssue({ ...issue, upvote_count: issue.upvote_count - 1 });
                setHasUpvoted(false);
            } else {
                await supabase.from('upvotes').insert({ issue_id: id, user_id: user.id });
                await supabase.from('issues').update({ upvote_count: issue.upvote_count + 1 }).eq('id', id);
                setIssue({ ...issue, upvote_count: issue.upvote_count + 1 });
                setHasUpvoted(true);
            }
        } catch (error: any) {
            console.error('Upvote error:', error);
            Alert.alert('Error', 'Failed to upvote');
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!issue) {
        return (
            <View style={styles.centered}>
                <Text>Issue not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView>
                {/* Hero Image */}
                <Image source={{ uri: issue.image_url }} style={styles.heroImage} resizeMode="cover" />

                {/* Content */}
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <StatusBadge status={issue.status} />
                            <Text style={styles.category}>{issue.category}</Text>
                        </View>
                        <Text style={styles.title}>{issue.title}</Text>
                    </View>

                    {/* Meta Info */}
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <MapPin size={16} color={Colors.textLight} />
                            <Text style={styles.metaText}>{issue.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Calendar size={16} color={Colors.textLight} />
                            <Text style={styles.metaText}>
                                {new Date(issue.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <User size={16} color={Colors.textLight} />
                            <Text style={styles.metaText}>Anonymous</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{issue.description}</Text>
                    </View>

                    {/* Upvote Button */}
                    <TouchableOpacity
                        style={[styles.upvoteCard, hasUpvoted && styles.upvoteCardActive]}
                        onPress={handleUpvote}
                    >
                        <LinearGradient
                            colors={hasUpvoted ? ['#312EFF', '#5B59FF'] : ['#F3F4F6', '#F9FAFB']}
                            style={styles.upvoteGradient}
                        >
                            <ThumbsUp
                                size={24}
                                color={hasUpvoted ? Colors.white : Colors.primary}
                                fill={hasUpvoted ? Colors.white : 'transparent'}
                            />
                            <View>
                                <Text style={[styles.upvoteCount, hasUpvoted && styles.upvoteCountActive]}>
                                    {issue.upvote_count || 0} Upvotes
                                </Text>
                                <Text style={[styles.upvoteLabel, hasUpvoted && styles.upvoteLabelActive]}>
                                    {hasUpvoted ? 'You upvoted this' : 'Tap to upvote'}
                                </Text>
                            </View>
                            <TrendingUp
                                size={20}
                                color={hasUpvoted ? Colors.white : Colors.textLight}
                            />
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Milestones */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Progress Timeline</Text>
                        {milestones.map((milestone, index) => (
                            <View key={milestone.id} style={styles.milestoneContainer}>
                                <View style={styles.milestoneLeft}>
                                    <View
                                        style={[
                                            styles.milestoneCircle,
                                            milestone.completed && styles.milestoneCircleCompleted,
                                        ]}
                                    />
                                    {index < milestones.length - 1 && (
                                        <View
                                            style={[
                                                styles.milestoneLine,
                                                milestone.completed && styles.milestoneLineCompleted,
                                            ]}
                                        />
                                    )}
                                </View>
                                <View style={styles.milestoneRight}>
                                    <Text
                                        style={[
                                            styles.milestoneTitle,
                                            milestone.completed && styles.milestoneTitleCompleted,
                                        ]}
                                    >
                                        {milestone.title}
                                    </Text>
                                    <Text style={styles.milestoneDescription}>{milestone.description}</Text>
                                    {milestone.date && (
                                        <Text style={styles.milestoneDate}>
                                            {new Date(milestone.date).toLocaleDateString()}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Sponsorship Card */}
                    {fundingData && (
                        <SponsorshipCard
                            issueId={issue.id}
                            currentAmount={fundingData.current_amount || 0}
                            goalAmount={fundingData.goal_amount}
                            sponsorCount={fundingData.sponsor_count || 0}
                            currency={fundingData.currency || 'SLE'}
                            onSponsorPress={() => setShowDonateModal(true)}
                        />
                    )}

                    {/* Donate Button (if no funding data yet) */}
                    {!fundingData && (
                        <TouchableOpacity
                            style={styles.donateButton}
                            onPress={() => setShowDonateModal(true)}
                        >
                            <LinearGradient
                                colors={['#EF4444', '#DC2626']}
                                style={styles.donateGradient}
                            >
                                <Heart size={20} color={Colors.white} />
                                <Text style={styles.donateText}>Support This Issue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Sponsorship Modal */}
            <SponsorshipModal
                visible={showDonateModal}
                onClose={() => setShowDonateModal(false)}
                issueId={issue.id}
                issueTitle={issue.title}
                onSuccess={() => fetchIssueData()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#E5E7EB',
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    category: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        lineHeight: 32,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
    },
    upvoteCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },
    upvoteCardActive: {},
    upvoteGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    upvoteCount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    upvoteCountActive: {
        color: Colors.white,
    },
    upvoteLabel: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 2,
    },
    upvoteLabelActive: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    milestoneContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    milestoneLeft: {
        alignItems: 'center',
        marginRight: 16,
    },
    milestoneCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
    },
    milestoneCircleCompleted: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    milestoneLine: {
        width: 3,
        flex: 1,
        backgroundColor: Colors.border,
        marginVertical: 4,
    },
    milestoneLineCompleted: {
        backgroundColor: Colors.primary,
    },
    milestoneRight: {
        flex: 1,
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textLight,
        marginBottom: 4,
    },
    milestoneTitleCompleted: {
        color: Colors.text,
    },
    milestoneDescription: {
        fontSize: 14,
        color: Colors.textLight,
        lineHeight: 20,
    },
    milestoneDate: {
        fontSize: 12,
        color: Colors.textLight,
        marginTop: 4,
    },
    donateButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
    },
    donateGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    donateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
});
