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
                colors={['#E9D5FF', '#F3E8FF']}
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
                                <ArrowRight size={24} color="#9333EA" />
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
        <View style={[styles.screenContainer, { backgroundColor: '#F9FAFB' }]}>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerRow}>
                    <View style={styles.userInfo}>
                        <LinearGradient
                            colors={['#FCD34D', '#F59E0B']}
                            style={styles.userAvatar}
                        >
                            <Text style={styles.userAvatarText}>M</Text>
                        </LinearGradient>
                        <View>
                            <Text style={styles.userName}>Hello Citizen</Text>
                            <View style={styles.progressRow}>
                                <Shield size={16} color="#F59E0B" />
                                <Text style={styles.citizenLevel}>Active Citizen</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.roundBtn}>
                        <Bell size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={styles.titleRow}>
                    <Text style={styles.title}>Community{'\n'}Updates</Text>
                    <TouchableOpacity style={styles.roundBtn}>
                        <Search size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardsContainer}>
                    <LinearGradient
                        colors={['#DBEAFE', '#EFF6FF']}
                        style={styles.courseCard}
                    >
                        <View style={styles.courseHeader}>
                            <View style={styles.iconBox}>
                                <AlertTriangle size={20} color="#DC2626" />
                            </View>
                            <View style={styles.ratingBadge}>
                                <Text>🔥</Text>
                                <Text style={styles.ratingText}>Urgent</Text>
                            </View>
                        </View>

                        <Text style={styles.categoryText}>Sanitation</Text>
                        <Text style={styles.courseTitle}>Uncollected Garbage at{'\n'}Hill Station</Text>

                        <View style={styles.courseFooter}>
                            <View style={styles.avatarsRow}>
                                <View style={[styles.miniAvatar, { backgroundColor: '#60A5FA', zIndex: 4 }]} />
                                <View style={[styles.miniAvatar, { backgroundColor: '#F472B6', marginLeft: -8, zIndex: 3 }]} />
                                <View style={[styles.miniAvatar, { backgroundColor: '#4B5563', marginLeft: -8, zIndex: 1 }]}>
                                    <Text style={styles.miniAvatarText}>50+</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.arrowBtn} onPress={completeOnboarding}>
                                <ArrowRight size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#FEF3C7', '#FFFBEB']}
                        style={styles.courseCard}
                    >
                        <View style={styles.courseHeader}>
                            <View style={styles.iconBox}>
                                <MapPin size={20} color="#D97706" />
                            </View>
                            <View style={styles.ratingBadge}>
                                <Text>🚧</Text>
                                <Text style={styles.ratingText}>In Progress</Text>
                            </View>
                        </View>

                        <Text style={styles.categoryText}>Infrastructure</Text>
                        <Text style={styles.courseTitle}>Broken Street Light{'\n'}Main Road</Text>

                        <View style={styles.courseFooter}>
                            <View style={styles.avatarsRow}>
                                <View style={[styles.miniAvatar, { backgroundColor: '#34D399', zIndex: 4 }]} />
                                <View style={[styles.miniAvatar, { backgroundColor: '#F87171', marginLeft: -8, zIndex: 3 }]} />
                                <View style={[styles.miniAvatar, { backgroundColor: '#4B5563', marginLeft: -8, zIndex: 1 }]}>
                                    <Text style={styles.miniAvatarText}>20+</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.arrowBtn} onPress={completeOnboarding}>
                                <ArrowRight size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>


            </ScrollView>
        </View>
    );

    const Screen3 = () => (
        <View style={[styles.screenContainer, { backgroundColor: '#F9FAFB' }]}>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.roundBtn} onPress={() => setActiveScreen(2)}>
                        <ChevronLeft size={24} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.roundBtn}>
                        <MoreVertical size={24} color="#374151" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.bigTitle}>Impact{'\n'}Tracker</Text>

                <View style={styles.statsRow}>
                    <LinearGradient
                        colors={['#E5E7EB', '#F3F4F6']}
                        style={styles.statCard}
                    >
                        <View style={styles.statHeader}>
                            <View style={styles.statLabel}>
                                <AlertTriangle size={20} color="#374151" />
                                <Text style={styles.statLabelText}>Reported</Text>
                            </View>
                            <View style={styles.smallIconBtn}>
                                <TrendingUp size={16} color="#374151" />
                            </View>
                        </View>
                        <Text style={styles.statValue}>15</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={['#D1FAE5', '#ECFDF5']}
                        style={styles.statCard}
                    >
                        <View style={styles.statHeader}>
                            <View style={styles.statLabel}>
                                <CheckCircle size={20} color="#059669" />
                                <Text style={styles.statLabelText}>Fixed</Text>
                            </View>
                            <View style={styles.smallIconBtn}>
                                <TrendingUp size={16} color="#059669" />
                            </View>
                        </View>
                        <Text style={[styles.statValue, { color: '#059669' }]}>8</Text>
                    </LinearGradient>
                </View>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleRow}>
                        <TrendingUp size={20} color="#374151" />
                        <Text style={styles.sectionTitle}>Resolution Rate</Text>
                    </View>
                    <TouchableOpacity style={styles.roundBtn}>
                        <MoreVertical size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['#E9D5FF', '#DCFCE7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chartCard}
                >
                    <View style={styles.chartContainer}>
                        <View style={styles.chartColumn}>
                            <View style={styles.chartBarContainer}>
                                <LinearGradient colors={['#FEF08A', '#FDE047']} style={[styles.barBack, { height: 128 }]}>
                                </LinearGradient>
                                <LinearGradient colors={['#D8B4FE', '#C084FC']} style={[styles.barFront, { height: 60, bottom: 16 }]}>
                                    <View style={[styles.barBadge, { top: -24 }]}>
                                        <Text style={styles.barBadgeText}>5</Text>
                                    </View>
                                </LinearGradient>
                            </View>
                            <Text style={styles.monthText}>May</Text>
                        </View>

                        <View style={styles.chartColumn}>
                            <View style={styles.chartBarContainer}>
                                <LinearGradient colors={['#D8B4FE', '#C084FC']} style={[styles.barBack, { height: 160 }]}>
                                </LinearGradient>
                                <View style={[styles.barFront, { height: 100, bottom: 24, backgroundColor: '#111827' }]}>
                                    <Text style={styles.barBigValue}>12</Text>
                                    <Text style={styles.barLabel}>fixed</Text>
                                </View>
                            </View>
                            <Text style={styles.monthText}>June</Text>
                        </View>

                        <View style={styles.chartColumn}>
                            <View style={styles.chartBarContainer}>
                                <LinearGradient colors={['#BBF7D0', '#86EFAC']} style={[styles.barBack, { height: 144 }]}>
                                </LinearGradient>
                                <View style={[styles.barFront, { height: 80, bottom: 16, backgroundColor: '#111827' }]}>
                                    <Text style={styles.barBigValue}>8</Text>
                                    <Text style={styles.barLabel}>fixed</Text>
                                </View>
                            </View>
                            <Text style={styles.monthText}>July</Text>
                        </View>
                    </View>
                </LinearGradient>


            </ScrollView>
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
        backgroundColor: '#9333EA',
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
        shadowColor: '#000',
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
        backgroundColor: '#F3E8FF',
        borderWidth: 2,
        borderColor: '#D8B4FE',
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
});
