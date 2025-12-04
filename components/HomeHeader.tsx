import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, Bell, Sparkles, CircleHelp, FileText, Pencil, AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { SearchModal } from './SearchModal';
import { EmergencyModal } from './EmergencyModal';
import { NotificationsModal } from './NotificationsModal';
import { AskModal } from './AskModal';
import { AnswerModal } from './AnswerModal';
import { useRouter } from 'expo-router';

export function HomeHeader() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showAsk, setShowAsk] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setUserData(profile || { email: user.email });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const getAvatarUrl = () => {
        if (userData?.avatar_url) {
            return userData.avatar_url;
        }
        // Generate avatar from email using UI Avatars
        const name = userData?.full_name || userData?.email || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=312EFF&color=fff&size=128`;
    };

    return (
        <>
            <View style={styles.container}>
                <LinearGradient
                    colors={['#1900ffff', '#ffffffff', '#5100ffff']}
                    start={{ x: -1.5, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradient, { paddingTop: insets.top + 35 }]}
                >
                    <View style={styles.cardContainer}>
                        {/* Top Bar */}
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                style={styles.avatarContainer}
                                onPress={() => router.push('/edit-profile')}
                            >
                                <Image
                                    source={{ uri: getAvatarUrl() }}
                                    style={styles.avatar}
                                />
                            </TouchableOpacity>
                            <View style={styles.topIcons}>
                                <TouchableOpacity style={styles.iconButton} onPress={() => setShowSearch(true)}>
                                    <Search size={24} color="#ffffffff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => setShowNotifications(true)}
                                >
                                    <Bell size={24} color="#ffffffff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Input Section */}
                        <View style={styles.inputSection}>
                            <View style={styles.inputShadowWrapper}>
                                <View style={styles.inputContainer}>
                                    <BlurView intensity={20} tint="light" style={styles.inputBlur}>
                                        <Sparkles size={20} color="#0284c7" style={styles.sparkleIcon} />
                                        <TextInput
                                            placeholder="What do you want to ask or share?"
                                            placeholderTextColor="#6b7280"
                                            style={styles.textInput}
                                            onFocus={() => setShowSearch(true)}
                                        />
                                    </BlurView>
                                </View>
                            </View>

                            {/* Buttons Row */}
                            <View style={styles.buttonsRow}>
                                <TouchableOpacity
                                    style={styles.actionShadowWrapper}
                                    onPress={() => setShowAsk(true)}
                                >
                                    <View style={styles.actionContainer}>
                                        <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
                                            <CircleHelp size={18} color="#374151" />
                                            <Text style={styles.buttonText}>Ask</Text>
                                        </BlurView>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionShadowWrapper}
                                    onPress={() => setShowAnswer(true)}
                                >
                                    <View style={styles.actionContainer}>
                                        <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
                                            <FileText size={18} color="#374151" />
                                            <Text style={styles.buttonText}>Answer</Text>
                                        </BlurView>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionShadowWrapper}
                                    onPress={() => setShowEmergency(true)}
                                >
                                    <View style={styles.actionContainer}>
                                        <BlurView intensity={30} tint="light" style={styles.buttonBlur}>
                                            <AlertTriangle size={18} color="#EF4444" />
                                            <Text style={[styles.buttonText, { color: '#EF4444' }]}>Emergency</Text>
                                        </BlurView>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            <SearchModal visible={showSearch} onClose={() => setShowSearch(false)} />
            <EmergencyModal visible={showEmergency} onClose={() => setShowEmergency(false)} />
            <NotificationsModal visible={showNotifications} onClose={() => setShowNotifications(false)} />
            <AskModal visible={showAsk} onClose={() => setShowAsk(false)} />
            <AnswerModal visible={showAnswer} onClose={() => setShowAnswer(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {},
    gradient: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    cardContainer: {},
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e5e7eb',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    topIcons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    inputSection: {
        gap: 16,
    },
    inputShadowWrapper: {
        borderRadius: 16,
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    inputContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    inputBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    sparkleIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionShadowWrapper: {
        flex: 1,
        borderRadius: 14,
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    actionContainer: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    buttonBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        gap: 8,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
});
