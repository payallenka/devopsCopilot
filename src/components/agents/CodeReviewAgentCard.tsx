"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileSearch, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { identifyCodeSmells } from '@/ai/flows/identify-code-smells';
import { summarizePullRequest } from '@/ai/flows/code-review-summary';

export function CodeReviewAgentCard() {
  const [diffText, setDiffText] = useState<string>('');
  const [smellsSummary, setSmellsSummary] = useState<string | null>(null);
  const [prSummary, setPrSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAnalyzePr = async () => {
    if (!diffText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste the PR diff text.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSmellsSummary(null);
    setPrSummary(null);
    toast({ title: "Analyzing PR...", description: "AI is reviewing the code diff." });

    try {
      const [smellsResult, summaryResult] = await Promise.all([
        identifyCodeSmells({ diffText }),
        summarizePullRequest({ prDiff: diffText })
      ]);
      
      setSmellsSummary(smellsResult.summary);
      setPrSummary(summaryResult.summary);
      toast({ title: "Analysis Complete", description: "PR review summaries are available." });
    } catch (error) {
      console.error("Error analyzing PR:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the PR. Please try again.",
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
          <FileSearch className="h-6 w-6 text-primary" />
          Code Review Agent
        </CardTitle>
        <CardDescription>Analyzes pull requests for code smells and provides summaries using Gemini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="prDiff" className="block text-sm font-medium text-foreground mb-1">
            Pull Request Diff
          </label>
          <Textarea
            id="prDiff"
            placeholder="Paste your PR diff text here..."
            value={diffText}
            onChange={(e) => setDiffText(e.target.value)}
            rows={10}
            className="bg-white dark:bg-card"
          />
        </div>
        {smellsSummary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Code Smells Analysis:</h3>
            <pre className="p-3 bg-secondary rounded-md text-sm overflow-x-auto text-secondary-foreground">{smellsSummary}</pre>
          </div>
        )}
        {prSummary && (
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Pull Request Summary:</h3>
            <pre className="p-3 bg-secondary rounded-md text-sm overflow-x-auto text-secondary-foreground">{prSummary}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyzePr} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Pull Request"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
