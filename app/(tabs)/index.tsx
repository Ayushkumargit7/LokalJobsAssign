import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useJobs } from '@/hooks/useJobs';
import { JobCard } from '@/components/JobCard';
import { ErrorView } from '@/components/ErrorView';
import { EmptyView } from '@/components/EmptyView';

export default function JobsScreen() {
  const [page, setPage] = useState(1);
  const { jobs, loading, error, refreshing, refresh, loadMore } = useJobs(page);

  const renderItem = useCallback(({ item }) => (
    <Link href={`/job/${item.id}`} asChild>
      <Pressable>
        <JobCard job={item} />
      </Pressable>
    </Link>
  ), []);

  if (error && !jobs.length) {
    return <ErrorView onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Jobs</Text>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading && <EmptyView message="No jobs available" />}
        ListFooterComponent={loading && <ActivityIndicator style={styles.loader} />}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
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
  loader: {
    padding: 16,
  },
});