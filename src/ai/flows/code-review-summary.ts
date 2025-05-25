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
  summary: z.string().describe('A concise summary of the pull request.'),
});
export type SummarizePullRequestOutput = z.infer<typeof SummarizePullRequestOutputSchema>;

export async function summarizePullRequest(input: SummarizePullRequestInput): Promise<SummarizePullRequestOutput> {
  return summarizePullRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePullRequestPrompt',
  input: {schema: SummarizePullRequestInputSchema},
  output: {schema: SummarizePullRequestOutputSchema},
  prompt: `You are a code review assistant. Summarize the following pull request diff, highlighting key changes and potential issues:\n\nDiff:\n{{prDiff}}`,
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
