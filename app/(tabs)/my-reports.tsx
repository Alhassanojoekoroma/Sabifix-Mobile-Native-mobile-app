import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { IssueCard } from '../../components/IssueCard';
import { Ionicons } from '@expo/vector-icons';

export default function MyReportsScreen() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userUpvotes, setUserUpvotes] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUserIssues();
  }, []);

  const fetchUserIssues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Get issues created by this user
      const { data: issuesData, error } = await supabase
        .from('issues')
        .select('*')
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIssues(issuesData || []);

      // Get user's upvotes
      const { data: upvotesData } = await supabase
        .from('upvotes')
        .select('issue_id')
        .eq('user_id', user.id);

      setUserUpvotes(upvotesData?.map(u => u.issue_id) || []);
    } catch (error: any) {
      console.error('Error fetching user issues:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserIssues();
  };

  const toggleUpvote = async (issueId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const hasUpvoted = userUpvotes.includes(issueId);

      if (hasUpvoted) {
        await supabase.from('upvotes').delete().eq('issue_id', issueId).eq('user_id', user.id);
        setUserUpvotes(prev => prev.filter(id => id !== issueId));

        const issue = issues.find(i => i.id === issueId);
        if (issue) {
          await supabase.from('issues').update({ upvote_count: issue.upvote_count - 1 }).eq('id', issueId);
          setIssues(prev => prev.map(i =>
            i.id === issueId ? { ...i, upvote_count: i.upvote_count - 1 } : i
          ));
        }
      } else {
        await supabase.from('upvotes').insert({ issue_id: issueId, user_id: user.id });
        setUserUpvotes(prev => [...prev, issueId]);

        const issue = issues.find(i => i.id === issueId);
        if (issue) {
          await supabase.from('issues').update({ upvote_count: issue.upvote_count + 1 }).eq('id', issueId);
          setIssues(prev => prev.map(i =>
            i.id === issueId ? { ...i, upvote_count: i.upvote_count + 1 } : i
          ));
        }
      }
    } catch (error: any) {
      console.error('Error toggling upvote:', error);
    }
  };

  const handleDeleteIssue = (issueId: string) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('issues')
                .delete()
                .eq('id', issueId);

              if (error) throw error;

              setIssues(prev => prev.filter(i => i.id !== issueId));
            } catch (error) {
              console.error('Error deleting issue:', error);
              Alert.alert("Error", "Failed to delete the report. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#312EFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <Text style={styles.headerSubtitle}>
          {issues.length} {issues.length === 1 ? 'issue' : 'issues'} reported
        </Text>
      </View>

      {issues.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptyText}>
            You haven't reported any issues yet. Tap the camera button to report your first issue!
          </Text>
        </View>
      ) : (
        <FlatList
          data={issues}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <IssueCard
                issue={item}
                onUpvote={toggleUpvote}
                hasUpvoted={userUpvotes.includes(item.id)}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteIssue(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.deleteText}>Delete Report</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#312EFF"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7F9',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  itemContainer: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteText: {
    marginLeft: 8,
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
});
