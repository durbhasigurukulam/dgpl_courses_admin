// The AI flow will be implemented in this file.
'use server';
/**
 * @fileOverview AI-powered tag suggestion for courses.
 *
 * - suggestCourseTags - A function that suggests relevant tags for a course based on its description.
 * - SuggestCourseTagsInput - The input type for the suggestCourseTags function.
 * - SuggestCourseTagsOutput - The return type for the suggestCourseTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCourseTagsInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the course for which to suggest tags.'),
});
export type SuggestCourseTagsInput = z.infer<typeof SuggestCourseTagsInputSchema>;

const SuggestCourseTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the course.'),
});
export type SuggestCourseTagsOutput = z.infer<typeof SuggestCourseTagsOutputSchema>;

export async function suggestCourseTags(input: SuggestCourseTagsInput): Promise<SuggestCourseTagsOutput> {
  return suggestCourseTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCourseTagsPrompt',
  input: {schema: SuggestCourseTagsInputSchema},
  output: {schema: SuggestCourseTagsOutputSchema},
  prompt: `You are an expert in generating relevant tags for online courses. Based on the course description provided, suggest a list of tags that can improve the course\'s discoverability.

Course Description: {{{description}}}

Suggested Tags:`, // Removed triple quotes and extra backslashes
});

const suggestCourseTagsFlow = ai.defineFlow(
  {
    name: 'suggestCourseTagsFlow',
    inputSchema: SuggestCourseTagsInputSchema,
    outputSchema: SuggestCourseTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
