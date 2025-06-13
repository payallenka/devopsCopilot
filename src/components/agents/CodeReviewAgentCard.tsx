"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileSearch, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { identifyCodeSmells } from '@/ai/flows/identify-code-smells';
import { summarizePullRequest } from '@/ai/flows/code-review-summary';
import { useSanitizedHtml } from '@/hooks/use-sanitized-html';

export function CodeReviewAgentCard() {
  const [diffText, setDiffText] = useState<string>('');
  const [rawSmellsSummary, setRawSmellsSummary] = useState<string | null>(null);
  const [rawPrSummary, setRawPrSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const { toast } = useToast();

  // Use the sanitized HTML hook
  const smellsSummary = useSanitizedHtml(rawSmellsSummary);
  const prSummary = useSanitizedHtml(rawPrSummary);

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging
  useEffect(() => {
    if (isClient && rawSmellsSummary) {
      console.log('Raw smells summary:', rawSmellsSummary);
      console.log('Sanitized smells summary:', smellsSummary);
    }
    if (isClient && rawPrSummary) {
      console.log('Raw PR summary:', rawPrSummary);
      console.log('Sanitized PR summary:', prSummary);
    }
  }, [isClient, rawSmellsSummary, rawPrSummary, smellsSummary, prSummary]);

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
    setRawSmellsSummary(null);
    setRawPrSummary(null);
    toast({ title: "Analyzing PR...", description: "AI is reviewing the code diff." });

    try {
      const [smellsResult, summaryResult] = await Promise.all([
        identifyCodeSmells({ diffText }),
        summarizePullRequest({ prDiff: diffText })
      ]);
      
      if (process.env.NODE_ENV === 'development' && isClient) {
        console.log('Received smells result:', smellsResult);
        console.log('Received summary result:', summaryResult);
      }
      
      setRawSmellsSummary(smellsResult.summary);
      setRawPrSummary(summaryResult.summary);
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

  const renderHtmlContent = (html: string | null, title: string) => {
    if (!html || !isClient) return null;

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        <div 
          className="prose prose-sm dark:prose-invert max-w-none
            prose-headings:font-semibold prose-headings:text-foreground
            prose-h1:text-2xl prose-h1:mb-6 prose-h1:text-primary
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
            prose-li:my-1 prose-li:text-muted-foreground
            prose-code:text-sm prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-secondary prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-pre:border prose-pre:border-border
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
            prose-img:rounded-lg prose-img:border prose-img:border-border
            prose-hr:border-border prose-hr:my-8
            prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:border-border prose-th:bg-secondary prose-th:p-2 prose-th:text-left
            prose-td:border prose-td:border-border prose-td:p-2
            prose-thead:border-b prose-thead:border-border
            prose-tr:border-b prose-tr:border-border last:prose-tr:border-0
            bg-card rounded-lg border border-border p-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
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
        
        {isClient && renderHtmlContent(smellsSummary, "Code Smells Analysis")}
        {isClient && renderHtmlContent(prSummary, "Pull Request Summary")}
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
