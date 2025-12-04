import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const router = useRouter();

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace('/auth/login');
                    },
                },
            ]
        );
    };

    const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true, rightElement }: any) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={22} color="#312EFF" />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {rightElement || (showArrow && <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />)}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <Text style={styles.headerSubtitle}>Manage your account and preferences</Text>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT</Text>
                    <View style={styles.sectionContent}>
                        <SettingItem
                            icon="person-outline"
                            title="Edit Profile"
                            subtitle="Update your personal information"
                            onPress={() => router.push('/edit-profile')}
                        />
                        <SettingItem
                            icon="shield-checkmark-outline"
                            title="Privacy & Security"
                            subtitle="Manage your privacy settings"
                            onPress={() => router.push('/privacy-security')}
                        />
                        <SettingItem
                            icon="key-outline"
                            title="Change Password"
                            subtitle="Update your password"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
                    <View style={styles.sectionContent}>
                        <SettingItem
                            icon="notifications-outline"
                            title="Push Notifications"
                            subtitle="Receive updates about your reports"
                            showArrow={false}
                            rightElement={
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                    trackColor={{ false: '#E5E7EB', true: '#BAE6FD' }}
                                    thumbColor={notificationsEnabled ? '#312EFF' : '#9CA3AF'}
                                />
                            }
                        />
                        <SettingItem
                            icon="mail-outline"
                            title="Email Notifications"
                            subtitle="Get email updates"
                            onPress={() => router.push('/privacy-security')}
                        />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SUPPORT</Text>
                    <View style={styles.sectionContent}>
                        <SettingItem
                            icon="help-circle-outline"
                            title="Help & Support"
                            subtitle="Get help with the app"
                            onPress={() => router.push('/help-support')}
                        />
                        <SettingItem
                            icon="document-text-outline"
                            title="Terms of Service"
                            subtitle="Read our terms"
                            onPress={() => router.push('/help-support')}
                        />
                        <SettingItem
                            icon="shield-outline"
                            title="Privacy Policy"
                            subtitle="How we protect your data"
                            onPress={() => router.push('/help-support')}
                        />
                        <SettingItem
                            icon="information-circle-outline"
                            title="About SabiFix"
                            subtitle="Version 1.0.0"
                            onPress={() => router.push('/about')}
                        />
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT ACTIONS</Text>
                    <View style={styles.sectionContent}>
                        <TouchableOpacity style={styles.dangerItem} onPress={handleSignOut}>
                            <View style={styles.settingLeft}>
                                <View style={[styles.iconContainer, styles.dangerIconContainer]}>
                                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                                </View>
                                <Text style={styles.dangerText}>Sign Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F9',
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        paddingHorizontal: 20,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    dangerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    dangerIconContainer: {
        backgroundColor: '#FEF2F2',
    },
    dangerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },
});
