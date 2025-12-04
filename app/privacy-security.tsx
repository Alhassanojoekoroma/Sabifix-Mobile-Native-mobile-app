import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Mail, Lock, Eye, Shield } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/colors';

export default function PrivacySecurityScreen() {
    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: settings } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (settings) {
                    setPushNotifications(settings.push_notifications ?? true);
                    setEmailNotifications(settings.email_notifications ?? true);
                    setProfileVisibility(settings.profile_visibility ?? true);
                    setTwoFactorAuth(settings.two_factor_auth ?? false);
                }
            }
        } catch (error) {
            console.log('Settings not found, using defaults');
        }
    };

    const saveSetting = async (key: string, value: boolean) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    [key]: value,
                    updated_at: new Date().toISOString(),
                });
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    };

    const SettingItem = ({ icon: Icon, title, description, value, onValueChange }: any) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <View style={styles.iconContainer}>
                    <Icon size={20} color={Colors.primary} />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    <Text style={styles.settingDescription}>{description}</Text>
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#D1D5DB', true: '#9796FF' }}
                thumbColor={value ? Colors.primary : '#F3F4F6'}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView>
                <View style={styles.content}>
                    {/* Notifications Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
                        <View style={styles.sectionContent}>
                            <SettingItem
                                icon={Bell}
                                title="Push Notifications"
                                description="Receive push notifications about updates"
                                value={pushNotifications}
                                onValueChange={(val: boolean) => {
                                    setPushNotifications(val);
                                    saveSetting('push_notifications', val);
                                }}
                            />
                            <SettingItem
                                icon={Mail}
                                title="Email Notifications"
                                description="Receive email updates about your reports"
                                value={emailNotifications}
                                onValueChange={(val: boolean) => {
                                    setEmailNotifications(val);
                                    saveSetting('email_notifications', val);
                                }}
                            />
                        </View>
                    </View>

                    {/* Privacy Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>PRIVACY</Text>
                        <View style={styles.sectionContent}>
                            <SettingItem
                                icon={Eye}
                                title="Profile Visibility"
                                description="Make your profile visible to other users"
                                value={profileVisibility}
                                onValueChange={(val: boolean) => {
                                    setProfileVisibility(val);
                                    saveSetting('profile_visibility', val);
                                }}
                            />
                        </View>
                    </View>

                    {/* Security Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECURITY</Text>
                        <View style={styles.sectionContent}>
                            <SettingItem
                                icon={Shield}
                                title="Two-Factor Authentication"
                                description="Add an extra layer of security"
                                value={twoFactorAuth}
                                onValueChange={(val: boolean) => {
                                    setTwoFactorAuth(val);
                                    saveSetting('two_factor_auth', val);
                                }}
                            />
                            <TouchableOpacity style={styles.linkItem}>
                                <Lock size={20} color={Colors.text} />
                                <Text style={styles.linkText}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Data Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DATA</Text>
                        <View style={styles.sectionContent}>
                            <TouchableOpacity style={styles.linkItem}>
                                <Text style={styles.linkText}>Download My Data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.linkItem}>
                                <Text style={[styles.linkText, styles.dangerText]}>Delete Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textLight,
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    sectionContent: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
        color: Colors.text,
        marginBottom: 2,
    },
    settingDescription: {
        fontSize: 13,
        color: Colors.textLight,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    linkText: {
        fontSize: 16,
        color: Colors.text,
    },
    dangerText: {
        color: Colors.error,
    },
});
