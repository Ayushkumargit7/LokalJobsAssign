import { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useBookmarks } from '@/hooks/useBookmarks';
import { JobCard } from '@/components/JobCard';
import { EmptyView } from '@/components/EmptyView';

export default function BookmarksScreen() {
  const { bookmarks } = useBookmarks();

  const renderItem = useCallback(({ item }) => (
    <Link href={`/job/${item.id}`} asChild>
      <Pressable>
        <JobCard job={item} />
      </Pressable>
    </Link>
  ), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Jobs</Text>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyView message="No bookmarked jobs" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
});