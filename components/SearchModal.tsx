import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { X, Search as SearchIcon } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { Colors } from '../constants/colors';
import { IssueCard } from './IssueCard';

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
}

export function SearchModal({ visible, onClose }: SearchModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [userUpvotes, setUserUpvotes] = useState<string[]>([]);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('issues')
                .select('*')
                .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
                .order('upvote_count', { ascending: false })
                .limit(20);

            if (error) throw error;
            setResults(data || []);

            // Get user upvotes
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: upvotesData } = await supabase
                    .from('upvotes')
                    .select('issue_id')
                    .eq('user_id', user.id);
                setUserUpvotes(upvotesData?.map(u => u.issue_id) || []);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (issueId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const hasUpvoted = userUpvotes.includes(issueId);

            if (hasUpvoted) {
                await supabase.from('upvotes').delete().eq('issue_id', issueId).eq('user_id', user.id);
                setUserUpvotes(prev => prev.filter(id => id !== issueId));

                const issue = results.find(i => i.id === issueId);
                if (issue) {
                    await supabase.from('issues').update({ upvote_count: issue.upvote_count - 1 }).eq('id', issueId);
                    setResults(prev => prev.map(i =>
                        i.id === issueId ? { ...i, upvote_count: i.upvote_count - 1 } : i
                    ));
                }
            } else {
                await supabase.from('upvotes').insert({ issue_id: issueId, user_id: user.id });
                setUserUpvotes(prev => [...prev, issueId]);

                const issue = results.find(i => i.id === issueId);
                if (issue) {
                    await supabase.from('issues').update({ upvote_count: issue.upvote_count + 1 }).eq('id', issueId);
                    setResults(prev => prev.map(i =>
                        i.id === issueId ? { ...i, upvote_count: i.upvote_count + 1 } : i
                    ));
                }
            }
        } catch (error) {
            console.error('Upvote error:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Search Issues</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <SearchIcon size={20} color={Colors.textLight} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by title, category, or location..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                        autoFocus
                        placeholderTextColor={Colors.textLight}
                    />
                </View>

                {loading ? (
                    <View style={styles.centered}>
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : results.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.resultItem}>
                                <IssueCard
                                    issue={item}
                                    onUpvote={handleUpvote}
                                    hasUpvoted={userUpvotes.includes(item.id)}
                                />
                            </View>
                        )}
                        contentContainerStyle={styles.results}
                    />
                ) : searchQuery.length >= 2 ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No results found for "{searchQuery}"</Text>
                    </View>
                ) : (
                    <View style={styles.centered}>
                        <SearchIcon size={48} color={Colors.textLight} />
                        <Text style={styles.emptyText}>Start typing to search</Text>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        margin: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: Colors.text,
    },
    results: {
        padding: 16,
    },
    resultItem: {
        marginBottom: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 16,
        color: Colors.textLight,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.textLight,
        marginTop: 16,
        textAlign: 'center',
    },
});
