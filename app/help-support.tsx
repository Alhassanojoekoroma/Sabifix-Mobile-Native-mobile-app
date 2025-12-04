import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, MessageCircle, FileText, ExternalLink } from 'lucide-react-native';
import { Colors } from '../constants/colors';

export default function HelpSupportScreen() {
    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Support',
            description: 'support@sabifix.sl',
            action: () => Linking.openURL('mailto:support@sabifix.sl'),
        },
        {
            icon: Phone,
            title: 'Phone Support',
            description: '+232 XX XXX XXXX',
            action: () => Linking.openURL('tel:+232XXXXXXXX'),
        },
        {
            icon: MessageCircle,
            title: 'Live Chat',
            description: 'Chat with our support team',
            action: () => { },
        },
    ];

    const resources = [
        {
            title: 'How to Report an Issue',
            description: 'Learn how to submit effective issue reports',
        },
        {
            title: 'Understanding Issue Status',
            description: 'What each status means for your report',
        },
        {
            title: 'Sponsorship Guide',
            description: 'How to sponsor community issues',
        },
        {
            title: 'Privacy Policy',
            description: 'Read our privacy policy',
        },
        {
            title: 'Terms of Service',
            description: 'View our terms and conditions',
        },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView>
                <View style={styles.content}>
                    {/* Contact Methods */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>CONTACT US</Text>
                        <View style={styles.sectionContent}>
                            {contactMethods.map((method, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.contactItem}
                                    onPress={method.action}
                                >
                                    <View style={styles.iconContainer}>
                                        <method.icon size={20} color={Colors.primary} />
                                    </View>
                                    <View style={styles.contactText}>
                                        <Text style={styles.contactTitle}>{method.title}</Text>
                                        <Text style={styles.contactDescription}>{method.description}</Text>
                                    </View>
                                    <ExternalLink size={20} color={Colors.textLight} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* FAQ */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
                        <View style={styles.sectionContent}>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>How do I report an issue?</Text>
                                <Text style={styles.faqAnswer}>
                                    Tap the camera button in the navigation bar, take a photo of the issue, and fill in the details.
                                </Text>
                            </View>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>How long does it take to resolve issues?</Text>
                                <Text style={styles.faqAnswer}>
                                    Resolution time varies depending on the severity and type of issue. You'll receive updates as progress is made.
                                </Text>
                            </View>
                            <View style={styles.faqItem}>
                                <Text style={styles.faqQuestion}>Can I track my reported issues?</Text>
                                <Text style={styles.faqAnswer}>
                                    Yes! Go to the "My Reports" tab to see all issues you've reported and their current status.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Resources */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>HELPFUL RESOURCES</Text>
                        <View style={styles.sectionContent}>
                            {resources.map((resource, index) => (
                                <TouchableOpacity key={index} style={styles.resourceItem}>
                                    <FileText size={20} color={Colors.text} />
                                    <View style={styles.resourceText}>
                                        <Text style={styles.resourceTitle}>{resource.title}</Text>
                                        <Text style={styles.resourceDescription}>{resource.description}</Text>
                                    </View>
                                    <ExternalLink size={16} color={Colors.textLight} />
                                </TouchableOpacity>
                            ))}
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
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
    contactText: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    contactDescription: {
        fontSize: 14,
        color: Colors.textLight,
    },
    faqItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: 14,
        color: Colors.textLight,
        lineHeight: 20,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    resourceText: {
        flex: 1,
    },
    resourceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    resourceDescription: {
        fontSize: 13,
        color: Colors.textLight,
    },
});
