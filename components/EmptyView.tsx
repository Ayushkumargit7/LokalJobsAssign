import { View, Text, StyleSheet } from 'react-native';
import { FileX } from 'lucide-react-native';

interface EmptyViewProps {
  message: string;
}

export function EmptyView({ message }: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <FileX size={48} color="#8E8E93" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 200,
  },
  message: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 12,
  },
});