import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, MessageCircle, ThumbsUp } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/colors';
import { formatDistanceToNow } from 'date-fns';

interface AnswerModalProps {
    visible: boolean;
    onClose: () => void;
}

interface Question {
    id: string;
    title: string;
    body: string;
    upvote_count: number;
    answer_count: number;
    created_at: string;
    user_id: string;
}

export function AnswerModal({ visible, onClose }: AnswerModalProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchQuestions();
        }
    }, [visible]);

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuestions(data || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Question }) => (
        <TouchableOpacity style={styles.questionCard}>
            <Text style={styles.questionTitle}>{item.title}</Text>
            <Text style={styles.questionBody} numberOfLines={2}>{item.body}</Text>

            <View style={styles.questionFooter}>
                <View style={styles.stat}>
                    <ThumbsUp size={16} color={Colors.textLight} />
                    <Text style={styles.statText}>{item.upvote_count}</Text>
                </View>
                <View style={styles.stat}>
                    <MessageCircle size={16} color={Colors.textLight} />
                    <Text style={styles.statText}>{item.answer_count} answers</Text>
                </View>
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </Text>
            </View>
        </TouchableOpacity>
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
                        <Text style={styles.title}>Community Questions</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : questions.length === 0 ? (
                        <View style={styles.centerContainer}>
                            <MessageCircle size={48} color={Colors.textLight} />
                            <Text style={styles.emptyText}>No questions yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={questions}
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
        height: '90%',
        backgroundColor: Colors.background,
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
    questionCard: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    questionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    questionBody: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 12,
        lineHeight: 20,
    },
    questionFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: Colors.textLight,
    },
    timeAgo: {
        fontSize: 12,
        color: Colors.textLight,
        marginLeft: 'auto',
    },
});
