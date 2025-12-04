import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as MonimeService from '../lib/monime';

interface SponsorshipCardProps {
    issueId: string;
    currentAmount: number;
    goalAmount?: number;
    sponsorCount: number;
    currency?: string;
    onSponsorPress: () => void;
}

export default function SponsorshipCard({
    issueId,
    currentAmount,
    goalAmount,
    sponsorCount,
    currency = 'SLE',
    onSponsorPress,
}: SponsorshipCardProps) {
    const progressPercentage = goalAmount
        ? Math.min((currentAmount / goalAmount) * 100, 100)
        : 0;

    const hasGoal = goalAmount && goalAmount > 0;

    return (
        <LinearGradient
            colors={['#DBEAFE', '#EFF6FF']}
            style={styles.card}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="cash" size={20} color="#312EFF" />
                </View>
                <Text style={styles.title}>Community Sponsorship</Text>
            </View>

            <View style={styles.statsContainer}>
                {/* Current Amount */}
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Raised</Text>
                    <Text style={styles.statValue}>
                        {MonimeService.formatAmount(currentAmount, currency)}
                    </Text>
                </View>

                {/* Goal Amount */}
                {hasGoal && (
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Goal</Text>
                        <Text style={styles.statValue}>
                            {MonimeService.formatAmount(goalAmount, currency)}
                        </Text>
                    </View>
                )}

                {/* Sponsor Count */}
                <View style={styles.statItem}>
                    <View style={styles.sponsorCountContainer}>
                        <Ionicons name="people" size={16} color="#4B5563" />
                        <Text style={styles.sponsorCount}>{sponsorCount}</Text>
                    </View>
                    <Text style={styles.statLabel}>
                        {sponsorCount === 1 ? 'Sponsor' : 'Sponsors'}
                    </Text>
                </View>
            </View>

            {/* Progress Bar */}
            {hasGoal && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#312EFF', '#9796FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                        />
                    </View>
                    <Text style={styles.progressText}>{progressPercentage.toFixed(0)}%</Text>
                </View>
            )}

            {/* Description */}
            <Text style={styles.description}>
                Help fund this community issue. All donations are anonymous and go directly to solving this problem.
            </Text>

            {/* Sponsor Button */}
            <TouchableOpacity
                style={styles.sponsorButton}
                onPress={onSponsorPress}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#312EFF', '#5B59FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <Ionicons name="heart" size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Sponsor This Issue</Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    sponsorCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    sponsorCount: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'right',
    },
    description: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
        marginBottom: 16,
    },
    sponsorButton: {
        borderRadius: 32,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
