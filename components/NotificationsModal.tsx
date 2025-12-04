import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Bell, CheckCircle, Info, Heart, AlertCircle } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/colors';
import { formatDistanceToNow } from 'date-fns';

interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'status_update' | 'sponsorship' | 'system' | 'achievement';
    read: boolean;
    created_at: string;
    data: any;
}

export function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchNotifications();
            markAllAsRead();
        }
    }, [visible]);

    const fetchNotifications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNotifications(data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'status_update':
                return <CheckCircle size={24} color={Colors.success} />;
            case 'sponsorship':
                return <Heart size={24} color={Colors.error} />;
            case 'achievement':
                return <Bell size={24} color={Colors.warning} />;
            default:
                return <Info size={24} color={Colors.primary} />;
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={styles.iconContainer}>
                {getIcon(item.type)}
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={20} style={styles.blur} />
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Notifications</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : notifications.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <Bell size={48} color={Colors.textLight} />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={notifications}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    blur: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        height: '80%',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    closeButton: {
        padding: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.textLight,
    },
    listContent: {
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    unreadItem: {
        backgroundColor: '#EFF6FF',
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 8,
        lineHeight: 20,
    },
    timeAgo: {
        fontSize: 12,
        color: Colors.textLight,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 8,
        marginTop: 8,
    },
});
