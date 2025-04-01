import { useState, useEffect, useCallback, useRef } from 'react';
import { Job } from '@/types';

interface ApiJob {
  id: number;
  title: string;
  company_name: string;
  primary_details: {
    Place: string;
    Salary: string;
  };
  whatsapp_no: string;
}

function transformApiJob(apiJob: ApiJob): Job {
  return {
    id: apiJob.id,
    title: apiJob.title,
    company: apiJob.company_name,
    location: apiJob.primary_details.Place,
    salary: apiJob.primary_details.Salary,
    phone: apiJob.whatsapp_no,
    description: apiJob.title // Using title as description since the content field is in a different language
  };
}

export function useJobs(initialPage: number) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef(true);

  const fetchJobs = useCallback(async (page: number, append = false) => {
    try {
      if (isMounted.current) setError(null);
      if (!append && isMounted.current) setLoading(true);

      const response = await fetch(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');

      const data = await response.json();
      const apiJobs = data.results || [];
      const transformedJobs = apiJobs.map(transformApiJob);

      if (isMounted.current) {
        setJobs(prev => append ? [...prev, ...transformedJobs] : transformedJobs);
        setHasMore(transformedJobs.length > 0);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const refresh = useCallback(() => {
    if (isMounted.current) setRefreshing(true);
    fetchJobs(1);
  }, [fetchJobs]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchJobs(initialPage + 1, true);
    }
  }, [loading, hasMore, initialPage, fetchJobs]);

  useEffect(() => {
    fetchJobs(initialPage);
    return () => {
      isMounted.current = false;
    };
  }, [initialPage, fetchJobs]);

  return { jobs, loading, error, refreshing, refresh, loadMore };
}