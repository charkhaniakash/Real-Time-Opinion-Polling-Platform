'use client';

import { useEffect } from 'react';
import { usePollStore } from '@/store/poll';
import { pollAPI } from '@/services/api';
import PollCard from './PollCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface PollsListProps {
  showResults?: boolean;
}

export default function PollsList({ showResults = false }: PollsListProps) {
  const { polls, loading, error, setPolls, setLoading, setError } = usePollStore();

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const pollsData = await pollAPI.getPolls();
        setPolls(pollsData);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [setPolls, setLoading, setError]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading polls...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8 text-destructive">
          <AlertCircle className="h-6 w-6 mr-2" />
          {error}
        </CardContent>
      </Card>
    );
  }

  if (polls.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          No polls found. Create your first poll to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          showResults={showResults}
        />
      ))}
    </div>
  );
}
