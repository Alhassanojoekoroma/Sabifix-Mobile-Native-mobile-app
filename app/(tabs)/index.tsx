import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { IssueCard } from '../../components/IssueCard';
import { HomeHeader } from '../../components/HomeHeader';
import { Colors } from '../../constants/colors';

export default function HomeScreen() {
  const [issues, setIssues] = useState<any[]>([]);
  const [userUpvotes, setUserUpvotes] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      // Get Issues
      const { data: issuesData, error } = await supabase
        .from('issues')
        .select('*')
        .order('upvote_count', { ascending: false });

      if (error) throw error;
      setIssues(issuesData || []);

      // Get user's upvotes
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: upvotesData } = await supabase
          .from('upvotes')
          .select('issue_id')
          .eq('user_id', user.id);

        setUserUpvotes(upvotesData?.map(u => u.issue_id) || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const upvoteIssue = async (issueId: string) => {
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <IssueCard
              issue={item}
              onUpvote={upvoteIssue}
              hasUpvoted={userUpvotes.includes(item.id)}
              rank={index + 1}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <HomeHeader />
            <View style={styles.textHeader}>
              <Text style={styles.subtitle}>Issue Categories</Text>
              <Text style={styles.description}>
                Browse issues by category
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 120,
  },
  itemContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerContainer: {
    marginBottom: 8,
  },
  textHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
