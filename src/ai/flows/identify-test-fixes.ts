'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyTestFixesInputSchema = z.object({
  testFailures: z.string().describe('The test failures to analyze'),
});

const IdentifyTestFixesOutputSchema = z.object({
  analysis: z.string().describe('Analysis of test failures and suggested fixes'),
});

export type IdentifyTestFixesInput = z.infer<typeof IdentifyTestFixesInputSchema>;
export type IdentifyTestFixesOutput = z.infer<typeof IdentifyTestFixesOutputSchema>;

const identifyTestFixesPrompt = ai.definePrompt({
  name: 'identifyTestFixesPrompt',
  input: {schema: IdentifyTestFixesInputSchema},
  output: {schema: IdentifyTestFixesOutputSchema},
  prompt: `You are a test analysis assistant. Analyze the following test failures and suggest fixes. Format your response in proper markdown with the following structure:

# Test Analysis Report

## Summary
[Provide a high-level summary of the test failures]

## Failed Tests Analysis

### 1. [Test Name]
- **File**: [Test file path]
- **Error**: [Error message]
- **Root Cause**: [Analysis of why the test is failing]
- **Suggested Fix**: [Detailed fix suggestion]
- **Code Changes Required**:
  \`\`\`typescript
  // Example code changes
  \`\`\`

### 2. [Test Name]
- **File**: [Test file path]
- **Error**: [Error message]
- **Root Cause**: [Analysis of why the test is failing]
- **Suggested Fix**: [Detailed fix suggestion]
- **Code Changes Required**:
  \`\`\`typescript
  // Example code changes
  \`\`\`

## General Recommendations
- [Recommendation 1]
- [Recommendation 2]

## Additional Notes
- [Any other important observations or considerations]

Test Failures:
{{testFailures}}`,
});

export { identifyTestFixesPrompt as prompt }; 