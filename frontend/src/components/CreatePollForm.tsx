'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { pollAPI } from '@/services/api';
import { usePollStore } from '@/store/poll';
import { toast } from 'sonner';

export default function CreatePollForm() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPoll } = usePollStore();

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a poll title');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    setIsSubmitting(true);

    try {
      const poll = await pollAPI.createPoll({
        title: title.trim(),
        options: validOptions
      });
      
      addPoll(poll);
      
      // Reset form
      setTitle('');
      setOptions(['', '']);
      
      toast.success('Poll created successfully!');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Create a poll and get real-time responses from your audience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="What's your favorite programming language?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  disabled={isSubmitting}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 10 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={isSubmitting}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
