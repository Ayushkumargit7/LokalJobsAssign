import { TouchableOpacity } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Job } from '@/types';

interface BookmarkButtonProps {
  job: Job;
}

export function BookmarkButton({ job }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const color = isBookmarked(job.id) ? '#007AFF' : '#8E8E93';

  return (
    <TouchableOpacity onPress={() => toggleBookmark(job)} style={{ padding: 8 }}>
      <Bookmark size={24} color={color} fill={color} />
    </TouchableOpacity>
  );
}