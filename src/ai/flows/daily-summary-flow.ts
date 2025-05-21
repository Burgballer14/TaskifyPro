
'use server';
/**
 * @fileOverview A flow to generate a personalized daily summary and score blurb for the user.
 *
 * - generateDailySummary - A function that handles the daily summary generation.
 * - DailySummaryInput - The input type for the generateDailySummary function.
 * - DailySummaryOutput - The return type for the generateDailySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailySummaryInputSchema = z.object({
  userName: z.string().describe("The name of the user."),
  tasksCompletedToday: z.number().describe("Number of tasks the user completed today."),
  tasksOpenToday: z.number().describe("Number of tasks still open and due today for the user."),
});
export type DailySummaryInput = z.infer<typeof DailySummaryInputSchema>;

const DailySummaryOutputSchema = z.object({
  personalizedSummary: z.string().describe("A short, personalized, and encouraging summary of the user's daily progress and what to focus on. Should be 2-3 sentences."),
  dailyScoreBlurb: z.string().describe("A fun, short phrase or title for the daily score (2-4 words), e.g., 'Productivity Power-Up!' or 'Today's Triumphs'.")
});
export type DailySummaryOutput = z.infer<typeof DailySummaryOutputSchema>;

export async function generateDailySummary(input: DailySummaryInput): Promise<DailySummaryOutput> {
  return dailySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailySummaryPrompt',
  input: {schema: DailySummaryInputSchema},
  output: {schema: DailySummaryOutputSchema},
  prompt: `You are Taskify Pro's friendly AI assistant! Your goal is to provide a personalized and encouraging daily summary for {{userName}}.

Today, {{userName}} has:
- Completed {{tasksCompletedToday}} tasks.
- Has {{tasksOpenToday}} tasks still open that are due today.

Based on this, generate:
1.  \`personalizedSummary\`: A brief, upbeat summary (2-3 sentences). 
    - If tasksCompletedToday is 0 and tasksOpenToday is 0, provide a general motivational message for the day.
    - If tasksCompletedToday > 0 and tasksOpenToday > 0, acknowledge completed tasks and gently encourage focus on open ones.
    - If tasksCompletedToday > 0 and tasksOpenToday is 0, congratulate them on completing tasks due today.
    - If tasksCompletedToday is 0 and tasksOpenToday > 0, encourage them to start tackling their tasks.
    Ensure the tone is always positive and supportive.
2.  \`dailyScoreBlurb\`: A creative and short (2-4 words) title or blurb for their daily score. Make it sound rewarding.

Example \`personalizedSummary\` if tasks are open:
"Great job on completing {{tasksCompletedToday}} tasks so far, {{userName}}! Keep the momentum going and focus on those {{tasksOpenToday}} tasks due today. You've got this!"

Example \`personalizedSummary\` if no tasks are open (and completed > 0):
"Amazing work, {{userName}}! You've crushed {{tasksCompletedToday}} tasks today, including everything due. Time to celebrate your productivity!"

Example \`dailyScoreBlurb\`:
"Daily Dynamo Score"
"Task Conqueror Points"
"Focus Fuel Level"
"Achievement Unlocked"
`,
});

const dailySummaryFlow = ai.defineFlow(
  {
    name: 'dailySummaryFlow',
    inputSchema: DailySummaryInputSchema,
    outputSchema: DailySummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // Fallback in case AI fails to generate structured output or returns nothing
      return {
        personalizedSummary: `Keep up the great work, ${input.userName}! Focus on your tasks and have a productive day.`,
        dailyScoreBlurb: "Daily Points",
      };
    }
    return output;
  }
);
