import { config } from 'dotenv';
config();

import '@/ai/flows/identify-code-smells.ts';
import '@/ai/flows/code-review-summary.ts';
import '@/ai/flows/suggest-test-fixes.ts';