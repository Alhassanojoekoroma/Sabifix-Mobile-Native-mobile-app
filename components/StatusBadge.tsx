import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case 'reported':
                return '#3B82F6';
            case 'in progress':
                return '#F59E0B';
            case 'resolved':
                return '#10B981';
            case 'rejected':
                return '#EF4444';
            default:
                return '#6B7280';
        }
    };

    return (
        <View style={[styles.badge, { backgroundColor: `${getStatusColor()}20` }]}>
            <Text style={[styles.text, { color: getStatusColor() }]}>
                {status}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    text: {
        fontSize: 11,
        fontWeight: '600',
    },
});
