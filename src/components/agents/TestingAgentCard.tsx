"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TestTube2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { suggestTestFixes } from '@/ai/flows/suggest-test-fixes';

export function TestingAgentCard() {
  const [testResults, setTestResults] = useState<string>('');
  const [codebase, setCodebase] = useState<string>('');
  const [suggestedFixes, setSuggestedFixes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSuggestFixes = async () => {
    if (!testResults.trim() || !codebase.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide both test results and relevant codebase.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestedFixes(null);
    toast({ title: "Analyzing Tests...", description: "AI is working on suggesting fixes." });

    try {
      const result = await suggestTestFixes({ testResults, codebase });
      setSuggestedFixes(result.suggestedFixes);
      toast({ title: "Analysis Complete", description: "Suggested test fixes are available." });
    } catch (error) {
      console.error("Error suggesting test fixes:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not suggest test fixes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <TestTube2 className="h-6 w-6 text-primary" />
          Testing Agent
        </CardTitle>
        <CardDescription>Runs tests (simulated) and suggests fixes for failures using Gemini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="testResults" className="block text-sm font-medium text-foreground mb-1">
            Test Results (Failed Tests)
          </label>
          <Textarea
            id="testResults"
            placeholder="Paste your failed test results here..."
            value={testResults}
            onChange={(e) => setTestResults(e.target.value)}
            rows={8}
            className="bg-white dark:bg-card"
          />
        </div>
        <div>
          <label htmlFor="codebase" className="block text-sm font-medium text-foreground mb-1">
            Relevant Codebase
          </label>
          <Textarea
            id="codebase"
            placeholder="Paste relevant code snippets here..."
            value={codebase}
            onChange={(e) => setCodebase(e.target.value)}
            rows={8}
            className="bg-white dark:bg-card"
          />
        </div>
        {suggestedFixes && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Suggested Fixes:</h3>
            <pre className="p-3 bg-secondary rounded-md text-sm overflow-x-auto text-secondary-foreground">{suggestedFixes}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSuggestFixes} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suggesting Fixes...
            </>
          ) : (
            "Suggest Test Fixes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
