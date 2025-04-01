import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useJob } from '@/hooks/useJob';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { job, loading, error } = useJob(id);

  if (loading) {
    return <LoadingView />;
  }

  if (error || !job) {
    return <ErrorView />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: job.title,
          headerRight: () => <BookmarkButton job={job} />,
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
          <Text style={styles.location}>{job.location}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary</Text>
          <Text style={styles.salary}>{job.salary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.phone}>{job.phone}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  company: {
    fontSize: 17,
    color: '#007AFF',
    marginBottom: 4,
  },
  location: {
    fontSize: 15,
    color: '#8E8E93',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  salary: {
    fontSize: 17,
    color: '#34C759',
  },
  phone: {
    fontSize: 17,
    color: '#007AFF',
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    color: '#3C3C43',
  },
});