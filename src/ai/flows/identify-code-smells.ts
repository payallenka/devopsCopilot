// This file is generated by Firebase Studio.
'use server';

/**
 * @fileOverview Identifies code smells in a given code diff using Gemini.
 *
 * - identifyCodeSmells - A function that takes a code diff as input and returns a summary of identified code smells.
 * - IdentifyCodeSmellsInput - The input type for the identifyCodeSmells function.
 * - IdentifyCodeSmellsOutput - The return type for the identifyCodeSmells function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { convertLatexToHtml } from '@/lib/latex-to-html';

const IdentifyCodeSmellsInputSchema = z.object({
  diffText: z
    .string()
    .describe('The diff text from a pull request.'),
});
export type IdentifyCodeSmellsInput = z.infer<typeof IdentifyCodeSmellsInputSchema>;

const IdentifyCodeSmellsOutputSchema = z.object({
  summary: z.string().describe('Content-only HTML summary of code smells analysis (no DOCTYPE, html, head, or body tags)'),
});
export type IdentifyCodeSmellsOutput = z.infer<typeof IdentifyCodeSmellsOutputSchema>;

export async function identifyCodeSmells(input: IdentifyCodeSmellsInput): Promise<IdentifyCodeSmellsOutput> {
  return identifyCodeSmellsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyCodeSmellsPrompt',
  input: {schema: IdentifyCodeSmellsInputSchema},
  output: {schema: IdentifyCodeSmellsOutputSchema},
  prompt: `You are a code review assistant. Analyze the following code diff and identify any code smells, potential bugs, or areas for improvement.

CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE EXACTLY:
1. Your response MUST be valid HTML content
2. You MUST use the EXACT HTML structure shown below
3. You MUST include ALL sections shown below
4. You MUST NOT use LaTeX or markdown
5. You MUST NOT include DOCTYPE, html, head, or body tags
6. You MUST start with <h1>Code Review Analysis</h1>
7. You MUST format code using <pre><code> tags
8. You MUST use proper HTML tags for all content
9. You MUST return ONLY the summary field with the complete HTML content

REQUIRED HTML STRUCTURE - COPY THIS EXACTLY:
<h1>Code Review Analysis</h1>

<h2>Summary</h2>
<p>[Your detailed analysis summary here]</p>

<h2>Issues Found</h2>
<ol>
  <li>
    <strong>[Issue Title]</strong>
    <ul>
      <li><strong>Severity:</strong> [High/Medium/Low]</li>
      <li><strong>Location:</strong> [File and line numbers]</li>
      <li><strong>Description:</strong> [Detailed description]</li>
      <li><strong>Current Code:</strong>
        <pre><code>[Code snippet]</code></pre>
      </li>
      <li><strong>Suggestion:</strong> [How to fix]</li>
      <li><strong>Fixed Code:</strong>
        <pre><code>[Fixed code example]</code></pre>
      </li>
    </ul>
  </li>
</ol>

<h2>Recommendations</h2>
<ul>
  <li>
    <strong>[Recommendation Title]</strong>
    <p>[Detailed explanation]</p>
  </li>
</ul>

<h2>Additional Notes</h2>
<p>[Any other observations]</p>

If no issues are found, use this structure:
<h1>Code Review Analysis</h1>

<h2>Summary</h2>
<p>[Brief explanation of why no issues were found]</p>

<h2>Issues Found</h2>
<p>No significant issues were identified in the provided code.</p>

<h2>Recommendations</h2>
<p>No specific recommendations at this time.</p>

<h2>Additional Notes</h2>
<p>[Any general observations about the code quality]</p>

Diff Text:
{{diffText}}`,
});

const validateHtmlStructure = (html: string): boolean => {
  const requiredSections = [
    '<h1>Code Review Analysis</h1>',
    '<h2>Summary</h2>',
    '<h2>Issues Found</h2>',
    '<h2>Recommendations</h2>',
    '<h2>Additional Notes</h2>'
  ];
  
  return requiredSections.every(section => html.includes(section));
};

const formatResponse = (content: string): string => {
  // If content is already properly formatted, return it
  if (validateHtmlStructure(content)) {
    // Ensure proper spacing and formatting
    return content
      .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Otherwise, wrap it in the required structure with proper formatting
  const formattedContent = content
    .replace(/<h1>.*?<\/h1>/g, '') // Remove any existing h1
    .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return `<h1>Code Review Analysis</h1>

<h2>Summary</h2>
<p>${formattedContent}</p>

<h2>Issues Found</h2>
<p>No significant issues were identified in the provided code.</p>

<h2>Recommendations</h2>
<p>No specific recommendations at this time.</p>

<h2>Additional Notes</h2>
<p>Please review the summary above for any potential concerns.</p>`;
};

const identifyCodeSmellsFlow = ai.defineFlow(
  {
    name: 'identifyCodeSmellsFlow',
    inputSchema: IdentifyCodeSmellsInputSchema,
    outputSchema: IdentifyCodeSmellsOutputSchema,
  },
  async input => {
    try {
      console.log('Starting code smells analysis...');
      const {output} = await prompt(input);
      console.log('Raw output received:', output);
      
      if (!output?.summary) {
        console.error('No summary in output');
        throw new Error('No summary received from AI');
      }

      // Convert any LaTeX in the output to HTML and ensure proper structure
      const htmlOutput = {
        summary: formatResponse(convertLatexToHtml(output.summary))
      };
      
      // Log the final formatted output
      console.log('Final formatted output:', htmlOutput);
      
      return htmlOutput;
    } catch (error: unknown) {
      console.error('Error in code smells analysis:', error);
      // Return a properly formatted error response
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        summary: formatResponse(`<p>An error occurred while analyzing the code: ${errorMessage}</p>`)
      };
    }
  }
);
