import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExternalLink, Github, Twitter, Mail } from 'lucide-react-native';
import { Colors } from '../constants/colors';

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView>
                <View style={styles.content}>
                    {/* App Info */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>SF</Text>
                        </View>
                        <Text style={styles.appName}>SabiFix</Text>
                        <Text style={styles.version}>Version 1.0.0</Text>
                        <Text style={styles.tagline}>
                            Empowering communities to report and resolve local issues
                        </Text>
                    </View>

                    {/* Mission */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OUR MISSION</Text>
                        <View style={styles.sectionContent}>
                            <Text style={styles.missionText}>
                                SabiFix is dedicated to improving communities across Sierra Leone by providing a platform for citizens to report infrastructure issues, track their resolution, and support community development through crowdfunding.
                            </Text>
                        </View>
                    </View>

                    {/* Features */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>KEY FEATURES</Text>
                        <View style={styles.sectionContent}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Report infrastructure issues with photos and location</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Track issue status and resolution progress</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Support community issues through sponsorships</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>View issues on an interactive map</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureBullet}>•</Text>
                                <Text style={styles.featureText}>Upvote issues to increase visibility</Text>
                            </View>
                        </View>
                    </View>

                    {/* Social Links */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>CONNECT WITH US</Text>
                        <View style={styles.sectionContent}>
                            <TouchableOpacity
                                style={styles.socialItem}
                                onPress={() => Linking.openURL('https://sabifix.sl')}
                            >
                                <ExternalLink size={20} color={Colors.text} />
                                <Text style={styles.socialText}>Website</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialItem}
                                onPress={() => Linking.openURL('https://twitter.com/sabifix')}
                            >
                                <Twitter size={20} color={Colors.text} />
                                <Text style={styles.socialText}>Twitter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialItem}
                                onPress={() => Linking.openURL('mailto:info@sabifix.sl')}
                            >
                                <Mail size={20} color={Colors.text} />
                                <Text style={styles.socialText}>Email</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Legal */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>LEGAL</Text>
                        <View style={styles.sectionContent}>
                            <TouchableOpacity style={styles.legalItem}>
                                <Text style={styles.legalText}>Terms of Service</Text>
                                <ExternalLink size={16} color={Colors.textLight} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.legalItem}>
                                <Text style={styles.legalText}>Privacy Policy</Text>
                                <ExternalLink size={16} color={Colors.textLight} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.legalItem}>
                                <Text style={styles.legalText}>Open Source Licenses</Text>
                                <ExternalLink size={16} color={Colors.textLight} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Copyright */}
                    <Text style={styles.copyright}>
                        © 2024 SabiFix. All rights reserved.
                    </Text>
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
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.white,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 12,
    },
    tagline: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
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
        padding: 16,
    },
    missionText: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 24,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    featureBullet: {
        fontSize: 18,
        color: Colors.primary,
        marginRight: 12,
        fontWeight: 'bold',
    },
    featureText: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    socialText: {
        fontSize: 16,
        color: Colors.text,
    },
    legalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    legalText: {
        fontSize: 16,
        color: Colors.text,
    },
    copyright: {
        fontSize: 13,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
});
