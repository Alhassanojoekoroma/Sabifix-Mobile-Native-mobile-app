import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ChevronLeft, Search, Bell, MoreVertical, MapPin, CheckCircle, TrendingUp, ArrowRight, Shield, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';

export default function OnboardingScreen() {
    const [activeScreen, setActiveScreen] = useState(1);
    const insets = useSafeAreaInsets();
    const { completeOnboarding } = useOnboarding();

    const Screen1 = () => (
        <View style={styles.screenContainer}>
            <LinearGradient
                colors={['#0014cbff', '#2308ceff']}
                style={styles.screenGradient}
            >

                <View style={styles.screenContent}>
                    <View style={styles.illustrationContainer}>
                        <Text style={[styles.star, { top: 16, right: 48, fontSize: 32 }]}>✦</Text>
                        <Text style={[styles.star, { top: 48, right: 96, fontSize: 24 }]}>✦</Text>
                        <Text style={[styles.star, { top: 80, right: 32, fontSize: 20 }]}>✦</Text>
                        <Text style={[styles.star, { top: 32, left: 64, fontSize: 24 }]}>✦</Text>

                        <View style={styles.svgContainer}>
                            <Image
                                source={require('../assets/images/onboarding-hero.png')}
                                style={{ width: '100%', height: '100%', borderRadius: 24 }}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.heading}>Fix Your{'\n'}Community</Text>
                        <Text style={styles.subtext}>
                            Report issues, upvote problems, and{'\n'}
                            watch your local council take action{'\n'}
                            to improve your neighborhood.
                        </Text>

                        <View style={styles.cardActions}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={completeOnboarding}
                            >
                                <Text style={styles.primaryButtonText}>Get Started</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setActiveScreen(2)}>
                                <ArrowRight size={24} color="#2308ceff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.indicators}>
                            <View style={[styles.indicator, styles.indicatorActive]} />
                            <View style={styles.indicator} />
                            <View style={styles.indicator} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const Screen2 = () => (
        <View style={styles.screenContainer}>
            <LinearGradient
                colors={['#ffbf00ff', '#ffffffff']}
                style={styles.modernScreenGradient}
            >
                <View style={styles.modernContent}>
                    {/* Simple Illustration */}
                    <View style={styles.modernIllustration}>
                        <View style={styles.modernIconCircle}>
                            <AlertTriangle size={60} color="#F97316" strokeWidth={2} />
                        </View>
                    </View>

                    {/* Content Card */}
                    <View style={styles.modernCard}>
                        <Text style={styles.modernTitle}>Report Issues</Text>

                        <Text style={styles.modernSubtitle}>
                            Spot a problem in your community? Report it instantly with a photo and description. Watch as local authorities take action to fix it.
                        </Text>

                        <TouchableOpacity
                            style={styles.modernButton}
                            onPress={completeOnboarding}
                        >
                            <Text style={styles.modernButtonText}>Get Started</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveScreen(3)}>
                            <Text style={styles.modernSecondaryText}>
                                Next: Track Progress →
                            </Text>
                        </TouchableOpacity>

                        {/* Indicators */}
                        <View style={styles.modernIndicators}>
                            <View style={styles.indicator} />
                            <View style={[styles.indicator, styles.indicatorActive]} />
                            <View style={styles.indicator} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );

    const Screen3 = () => (
        <View style={styles.screenContainer}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 253, 239, 0.95)']}
                style={styles.modernScreenGradient}
            >
                <View style={styles.modernContent}>
                    {/* Simple Illustration */}
                    <View style={styles.modernIllustration}>
                        <View style={[styles.modernIconCircle, { backgroundColor: '#FEF3C7' }]}>
                            <TrendingUp size={60} color="#EAB308" strokeWidth={2} />
                        </View>
                    </View>

                    {/* Content Card */}
                    <View style={styles.modernCard}>
                        <Text style={styles.modernTitle}>Track Progress</Text>

                        <Text style={styles.modernSubtitle}>
                            See real-time updates as local authorities work to resolve reported issues. Track the impact you're making in your community.
                        </Text>

                        <TouchableOpacity
                            style={styles.modernButton}
                            onPress={completeOnboarding}
                        >
                            <Text style={styles.modernButtonText}>Get Started</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setActiveScreen(1)}>
                            <Text style={styles.modernSecondaryText}>
                                ← Back to Intro
                            </Text>
                        </TouchableOpacity>

                        {/* Indicators */}
                        <View style={styles.modernIndicators}>
                            <View style={styles.indicator} />
                            <View style={styles.indicator} />
                            <View style={[styles.indicator, styles.indicatorActive]} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.navigation}>
                <TouchableOpacity
                    onPress={() => setActiveScreen(1)}
                    style={[styles.navBtn, activeScreen === 1 && styles.navBtnActive]}
                >
                    <Text style={[styles.navText, activeScreen === 1 && styles.navTextActive]}>Intro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveScreen(2)}
                    style={[styles.navBtn, activeScreen === 2 && styles.navBtnActive]}
                >
                    <Text style={[styles.navText, activeScreen === 2 && styles.navTextActive]}>Issues</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveScreen(3)}
                    style={[styles.navBtn, activeScreen === 3 && styles.navBtnActive]}
                >
                    <Text style={[styles.navText, activeScreen === 3 && styles.navTextActive]}>Impact</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentArea}>
                {activeScreen === 1 && <Screen1 />}
                {activeScreen === 2 && <Screen2 />}
                {activeScreen === 3 && <Screen3 />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 16,
    },
    navBtn: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
    },
    navBtnActive: {
        backgroundColor: '#0014cbff',
    },
    navText: {
        fontWeight: '500',
        color: '#374151',
    },
    navTextActive: {
        color: '#FFFFFF',
    },
    contentArea: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    screenContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 48,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    screenGradient: {
        flex: 1,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    statusIcons: {
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
    },
    signalBars: {
        flexDirection: 'row',
        gap: 2,
        alignItems: 'flex-end',
        marginRight: 4,
    },
    signalBar: {
        width: 3,
        backgroundColor: '#111827',
        borderRadius: 1,
    },
    battery: {
        width: 20,
        height: 10,
        borderWidth: 1,
        borderColor: '#111827',
        borderRadius: 2,
        padding: 1,
    },
    batteryInner: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 1,
    },
    screenContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingBottom: 32,
    },
    illustrationContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    star: {
        position: 'absolute',
        color: '#FFFFFF',
        fontWeight: '900',
    },
    svgContainer: {
        width: 300,
        height: 280,
        marginTop: 32,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        padding: 32,
        shadowColor: '#ffffffff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    heading: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
        color: '#111827',
    },
    subtext: {
        textAlign: 'center',
        color: '#4B5563',
        lineHeight: 20,
        marginBottom: 32,
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#111827',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#ffffffff',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicator: {
        width: 32,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D5DB',
    },
    indicatorActive: {
        width: 64,
        backgroundColor: '#111827',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    userInfo: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userAvatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    citizenLevel: {
        fontSize: 12,
        color: '#D97706',
        fontWeight: '600',
    },
    roundBtn: {
        padding: 8,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#111827',
    },
    cardsContainer: {
        gap: 16,
        marginBottom: 24,
    },
    courseCard: {
        borderRadius: 24,
        padding: 24,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    categoryText: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 4,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
        lineHeight: 24,
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarsRow: {
        flexDirection: 'row',
    },
    miniAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniAvatarText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
    },
    arrowBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bigTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 32,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        borderRadius: 24,
        padding: 24,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statLabelText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    smallIconBtn: {
        width: 32,
        height: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    chartCard: {
        borderRadius: 24,
        padding: 24,
        height: 300,
        marginBottom: 24,
    },
    chartContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 8,
    },
    chartColumn: {
        flex: 1,
        alignItems: 'center',
    },
    chartBarContainer: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        marginBottom: 12,
    },
    barBack: {
        width: 80,
        borderRadius: 40,
        opacity: 0.8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
        bottom: 0,
    },
    barFront: {
        width: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    barBadge: {
        backgroundColor: '#111827',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    barBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    barBigValue: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    barLabel: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    monthText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    getStartedBtn: {
        backgroundColor: '#9333EA',
        paddingVertical: 16,
        borderRadius: 32,
        alignItems: 'center',
    },
    getStartedBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    // Modern Onboarding Styles
    modernScreenGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modernContent: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    modernIllustration: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modernIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFE5D9',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    modernCard: {
        backgroundColor: 'rgba(255, 253, 239, 0.95)',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 32,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
        shadowColor: '#ffffffff',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modernTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
        textAlign: 'center',
    },
    modernSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    modernButton: {
        backgroundColor: '#111827',
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 9999,
        marginBottom: 16,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    modernButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modernSecondaryText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 24,
    },
    modernIndicators: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
});
