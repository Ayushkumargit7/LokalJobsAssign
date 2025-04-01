import { useState, useEffect, useRef } from 'react';
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

export function useJob(id: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        if (isMounted.current) setLoading(true);
        if (isMounted.current) setError(null);

        const response = await fetch(`https://testapi.getlokalapp.com/common/jobs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch job details');

        const data = await response.json();
        if (isMounted.current && data.results?.[0]) {
          setJob(transformApiJob(data.results[0]));
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }

    fetchJob();

    return () => {
      isMounted.current = false;
    };
  }, [id]);

  return { job, loading, error };
}