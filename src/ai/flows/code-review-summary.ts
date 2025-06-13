// src/ai/flows/code-review-summary.ts
'use server';
/**
 * @fileOverview Summarizes pull requests using Gemini for efficient code review.
 *
 * - summarizePullRequest - A function to summarize pull requests.
 * - SummarizePullRequestInput - The input type for the summarizePullRequest function.
 * - SummarizePullRequestOutput - The return type for the summarizePullRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePullRequestInputSchema = z.object({
  prDiff: z
    .string()
    .describe('The diff of the pull request to be summarized.'),
});
export type SummarizePullRequestInput = z.infer<typeof SummarizePullRequestInputSchema>;

const SummarizePullRequestOutputSchema = z.object({
  summary: z.string().describe('Content-only HTML summary of the pull request (no DOCTYPE, html, head, or body tags)'),
  sections: z.object({
    overview: z.string().describe('Content-only HTML overview section'),
    keyChanges: z.string().describe('Content-only HTML key changes section'),
    testingNotes: z.string().describe('Content-only HTML testing notes section'),
    reviewFocus: z.string().describe('Content-only HTML review focus areas section')
  }).describe('Individual sections of the PR summary in content-only HTML format')
});
export type SummarizePullRequestOutput = z.infer<typeof SummarizePullRequestOutputSchema>;

export async function summarizePullRequest(input: SummarizePullRequestInput): Promise<SummarizePullRequestOutput> {
  return summarizePullRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePullRequestPrompt',
  input: {schema: SummarizePullRequestInputSchema},
  output: {schema: SummarizePullRequestOutputSchema},
  prompt: `You are a code review assistant. Analyze the provided pull request diff and create a detailed summary in HTML format. 

CRITICAL INSTRUCTIONS:
1. Return ONLY the content HTML - do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags
2. Start directly with <h1>Pull Request Summary</h1>
3. Include all required sections with proper HTML formatting
4. Do not return a single-line summary

Required HTML structure (content only):
<h1>Pull Request Summary</h1>

<h2>Overview</h2>
<p>[Detailed analysis of what the PR changes and why]</p>

<h2>Key Changes</h2>
<ol>
  <li>
    <strong>[First Major Change]</strong>
    <ul>
      <li><strong>Type:</strong> [Actual type]</li>
      <li><strong>Impact:</strong> [Actual impact]</li>
      <li><strong>Files:</strong> [Actual files]</li>
    </ul>
  </li>
  [Additional changes as needed]
</ol>

<h2>Testing Notes</h2>
<ul>
  <li>[Specific testing considerations]</li>
  [Additional testing notes]
</ul>

<h2>Review Focus Areas</h2>
<ul>
  <li>[Specific areas needing attention]</li>
  [Additional focus areas]
</ul>

Example of correct output (content only):
<h1>Pull Request Summary</h1>
<h2>Overview</h2>
<p>This PR adds a new feature to...</p>
[rest of the content...]

Diff to analyze:
{{prDiff}}`,
});

const summarizePullRequestFlow = ai.defineFlow(
  {
    name: 'summarizePullRequestFlow',
    inputSchema: SummarizePullRequestInputSchema,
    outputSchema: SummarizePullRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
