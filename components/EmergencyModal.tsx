import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Phone, X, Shield, Flame, Ambulance, AlertTriangle } from 'lucide-react-native';
import { Colors } from '../constants/colors';

interface EmergencyModalProps {
    visible: boolean;
    onClose: () => void;
}

export function EmergencyModal({ visible, onClose }: EmergencyModalProps) {
    const emergencyContacts = [
        {
            name: 'Police',
            number: '112',
            description: 'General emergencies',
            icon: Shield,
            color: '#3B82F6',
        },
        {
            name: 'Ambulance',
            number: '999',
            description: 'Medical emergencies',
            icon: Ambulance,
            color: '#EF4444',
        },
        {
            name: 'Fire Service',
            number: '999',
            description: 'Fire emergencies',
            icon: Flame,
            color: '#F97316',
        },
        {
            name: 'Police Direct',
            number: '019',
            description: 'Police hotline',
            icon: Shield,
            color: '#1E40AF',
        },
        {
            name: 'Health Emergency',
            number: '117',
            description: 'Health/Ebola response',
            icon: Ambulance,
            color: '#DC2626',
        },
        {
            name: 'National Security',
            number: '119',
            description: 'ONS emergency line',
            icon: AlertTriangle,
            color: '#7C3AED',
        },
        {
            name: 'Disaster Mgmt',
            number: '1199',
            description: 'NDMA (Africell only)',
            icon: AlertTriangle,
            color: '#EAB308',
        },
    ];

    const callNumber = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={20} style={styles.blur} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Emergency Contacts</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Tap to call immediately. Only use in case of emergency.
                    </Text>

                    <View style={styles.grid}>
                        {emergencyContacts.map((contact, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => callNumber(contact.number)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${contact.color}20` }]}>
                                    <contact.icon size={28} color={contact.color} />
                                </View>
                                <Text style={styles.contactName}>{contact.name}</Text>
                                <Text style={styles.contactDescription}>{contact.description}</Text>
                                <Text style={styles.contactNumber}>{contact.number}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        width: '30%', // 3 columns for 7 contacts
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    contactName: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
        textAlign: 'center',
    },
    contactDescription: {
        fontSize: 10,
        color: Colors.textLight,
        marginBottom: 4,
        textAlign: 'center',
    },
    contactNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
});
