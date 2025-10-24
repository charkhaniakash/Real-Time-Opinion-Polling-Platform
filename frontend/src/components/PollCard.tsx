'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ThumbsUp, Users } from 'lucide-react';
import { Poll, PollOption } from '@/store/poll';
import { pollAPI } from '@/services/api';
import { usePollStore } from '@/store/poll';
import { getUserId } from '@/lib/user';
import { toast } from 'sonner';

interface PollCardProps {
  poll: Poll;
  showResults?: boolean;
}

export default function PollCard({ poll, showResults = false }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { updatePoll } = usePollStore();

  const userId = getUserId();

  const handleVote = async (optionId: string) => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      const updatedPoll = await pollAPI.vote(poll.id, {
        user_id: userId,
        option_id: optionId
      });
      
      updatePoll(updatedPoll);
      setSelectedOption(optionId);
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedPoll = hasLiked 
        ? await pollAPI.unlike(poll.id, { user_id: userId })
        : await pollAPI.like(poll.id, { user_id: userId });
      
      updatePoll(updatedPoll);
      setHasLiked(!hasLiked);
      toast.success(hasLiked ? 'Removed like' : 'Poll liked!');
    } catch (error) {
      console.error('Error liking poll:', error);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const getPercentage = (option: PollOption) => {
    if (poll.total_votes === 0) return 0;
    return Math.round((option.vote_count / poll.total_votes) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{poll.title}</CardTitle>
        <CardDescription>
          Created {formatDate(poll.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = getPercentage(option);
            const isSelected = selectedOption === option.id;
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="flex-1 justify-start"
                    onClick={() => handleVote(option.id)}
                    disabled={isVoting}
                  >
                    {option.text}
                  </Button>
                </div>
                
                {(showResults || selectedOption) && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{option.vote_count} votes</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{poll.total_votes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{poll.like_count} likes</span>
            </div>
          </div>

          <Button
            variant={hasLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
            {hasLiked ? 'Liked' : 'Like'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
