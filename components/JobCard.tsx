import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Phone, DollarSign } from 'lucide-react-native';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      
      <View style={styles.detail}>
        <MapPin size={16} color="#8E8E93" />
        <Text style={styles.detailText}>{job.location}</Text>
      </View>

      <View style={styles.detail}>
        <DollarSign size={16} color="#34C759" />
        <Text style={[styles.detailText, styles.salary]}>{job.salary}</Text>
      </View>

      <View style={styles.detail}>
        <Phone size={16} color="#007AFF" />
        <Text style={[styles.detailText, styles.phone]}>{job.phone}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#3C3C43',
  },
  salary: {
    color: '#34C759',
  },
  phone: {
    color: '#007AFF',
  },
});