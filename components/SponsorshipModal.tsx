import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, DollarSign, Lock, MessageSquare } from 'lucide-react-native';
import * as MonimeService from '../lib/monime';
import { supabase } from '../lib/supabase';

interface SponsorshipModalProps {
    visible: boolean;
    issueId: string;
    issueTitle: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PRESET_AMOUNTS = [1000, 2500, 5000, 10000]; // In minor units (10, 25, 50, 100 SLE)

export default function SponsorshipModal({
    visible,
    issueId,
    issueTitle,
    onClose,
    onSuccess,
}: SponsorshipModalProps) {
    const [customAmount, setCustomAmount] = useState('');
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (text: string) => {
        // Only allow numbers
        const numericValue = text.replace(/[^0-9]/g, '');
        setCustomAmount(numericValue);
        setSelectedAmount(null);
    };

    const getFinalAmount = (): number => {
        if (selectedAmount) return selectedAmount;
        if (customAmount) return MonimeService.toMinorUnits(parseFloat(customAmount));
        return 0;
    };

    const handleSponsor = async () => {
        const amount = getFinalAmount();

        if (amount < 1000) { // Minimum 10 SLE
            Alert.alert('Invalid Amount', 'Minimum sponsorship amount is Le 10.00');
            return;
        }

        setLoading(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Authentication Required', 'Please log in to sponsor this issue.');
                setLoading(false);
                return;
            }

            // Create sponsorship record in database
            const { data: sponsorship, error: dbError } = await supabase
                .from('sponsorships')
                .insert({
                    issue_id: issueId,
                    user_id: user.id,
                    amount,
                    currency: 'SLE',
                    payment_status: 'pending',
                    is_anonymous: isAnonymous,
                    message: message.trim() || null,
                })
                .select()
                .single();

            if (dbError) {
                console.error('Database error:', dbError);
                Alert.alert('Error', 'Failed to create sponsorship record. Please try again.');
                setLoading(false);
                return;
            }

            // Initiate payment with Monime
            const session = await MonimeService.createCheckoutSession({
                amount,
                currency: 'SLE',
                metadata: {
                    issue_id: issueId,
                    sponsorship_id: sponsorship.id,
                    is_anonymous: isAnonymous,
                },
                successUrl: 'sabifixapp://payment-success',
                cancelUrl: 'sabifixapp://payment-cancel',
            });

            if (session.url) {
                await Linking.openURL(session.url);
                onSuccess();
                onClose();
            } else {
                throw new Error('Failed to create payment session');
            }

            setLoading(false);
        } catch (error) {
            console.error('Sponsorship error:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Sponsor This Issue</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Issue Title */}
                        <View style={styles.issueTitleContainer}>
                            <Text style={styles.issueTitle} numberOfLines={2}>
                                {issueTitle}
                            </Text>
                        </View>

                        {/* Preset Amounts */}
                        <Text style={styles.sectionLabel}>Select Amount</Text>
                        <View style={styles.presetAmountsContainer}>
                            {PRESET_AMOUNTS.map((amount) => (
                                <TouchableOpacity
                                    key={amount}
                                    style={[
                                        styles.presetAmountButton,
                                        selectedAmount === amount && styles.presetAmountButtonActive,
                                    ]}
                                    onPress={() => handleAmountSelect(amount)}
                                >
                                    <Text
                                        style={[
                                            styles.presetAmountText,
                                            selectedAmount === amount && styles.presetAmountTextActive,
                                        ]}
                                    >
                                        {MonimeService.formatAmount(amount)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Custom Amount */}
                        <Text style={styles.sectionLabel}>Or Enter Custom Amount (SLE)</Text>
                        <View style={styles.inputContainer}>
                            <DollarSign size={20} color="#6B7280" />
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                value={customAmount}
                                onChangeText={handleCustomAmountChange}
                            />
                        </View>

                        {/* Anonymous Toggle */}
                        <View style={styles.toggleContainer}>
                            <View style={styles.toggleLabel}>
                                <Lock size={20} color="#312EFF" />
                                <View style={styles.toggleTextContainer}>
                                    <Text style={styles.toggleTitle}>Donate Anonymously</Text>
                                    <Text style={styles.toggleDescription}>
                                        Your name will not be shown publicly
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isAnonymous}
                                onValueChange={setIsAnonymous}
                                trackColor={{ false: '#D1D5DB', true: '#9796FF' }}
                                thumbColor={isAnonymous ? '#312EFF' : '#F3F4F6'}
                            />
                        </View>

                        {/* Optional Message */}
                        <Text style={styles.sectionLabel}>Message (Optional)</Text>
                        <View style={styles.messageInputContainer}>
                            <MessageSquare size={20} color="#6B7280" style={styles.messageIcon} />
                            <TextInput
                                style={styles.messageInput}
                                placeholder="Add a message of support..."
                                multiline
                                numberOfLines={3}
                                value={message}
                                onChangeText={setMessage}
                                maxLength={200}
                            />
                        </View>
                        <Text style={styles.characterCount}>{message.length}/200</Text>

                        {/* Summary */}
                        <View style={styles.summaryContainer}>
                            <Text style={styles.summaryLabel}>Total Amount:</Text>
                            <Text style={styles.summaryAmount}>
                                {MonimeService.formatAmount(getFinalAmount())}
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Sponsor Button */}
                    <TouchableOpacity
                        style={[styles.sponsorButton, loading && styles.sponsorButtonDisabled]}
                        onPress={handleSponsor}
                        disabled={loading || getFinalAmount() < 1000}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={loading || getFinalAmount() < 1000 ? ['#9CA3AF', '#9CA3AF'] : ['#312EFF', '#5B59FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Proceed to Payment
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    issueTitleContainer: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    issueTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    presetAmountsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    presetAmountButton: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#F3F4F6',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
    },
    presetAmountButtonActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#312EFF',
    },
    presetAmountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    presetAmountTextActive: {
        color: '#312EFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        color: '#111827',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    toggleLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toggleTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    toggleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    toggleDescription: {
        fontSize: 12,
        color: '#6B7280',
    },
    messageInputContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    messageIcon: {
        marginBottom: 8,
    },
    messageInput: {
        fontSize: 14,
        color: '#111827',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    characterCount: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'right',
        marginBottom: 20,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#DBEAFE',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#312EFF',
    },
    sponsorButton: {
        marginHorizontal: 20,
        borderRadius: 32,
        overflow: 'hidden',
    },
    sponsorButtonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
