'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePollForm from '@/components/CreatePollForm';
import PollsList from '@/components/PollsList';
import { PlusCircle, BarChart3, Vote } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('polls');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Vote className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">QuickPoll</h1>
              </div>
              <p className="text-muted-foreground hidden md:block">
                Real-time opinion polling platform
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="polls" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                All Polls
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Poll
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="polls" className="mt-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight">Active Polls</h2>
                  <p className="text-muted-foreground mt-2">
                    Vote on polls and see results update in real-time
                  </p>
                </div>
                <PollsList />
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="mt-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight">Create a Poll</h2>
                  <p className="text-muted-foreground mt-2">
                    Create a new poll and share it with your audience
                  </p>
                </div>
                <CreatePollForm />
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="mt-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight">Poll Results</h2>
                  <p className="text-muted-foreground mt-2">
                    View detailed results and analytics for all polls
                  </p>
                </div>
                <PollsList showResults={true} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
