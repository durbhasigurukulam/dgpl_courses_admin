// The AI flow
// 'use server'; // Not compatible with static export

import { z } from 'zod'; // Use client-side zod

const SuggestTagsForCourseInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
  courseDescription: z.string().describe('The description of the course.'),
});
export type SuggestTagsForCourseInput = z.infer<typeof SuggestTagsForCourseInputSchema>;

const SuggestTagsForCourseOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('An array of suggested tags for the course.'),
});
export type SuggestTagsForCourseOutput = z.infer<typeof SuggestTagsForCourseOutputSchema>;

export async function suggestTagsForCourse(input: SuggestTagsForCourseInput): Promise<SuggestTagsForCourseOutput> {
  console.warn("AI suggestions are disabled in static export mode.");
  return { suggestedTags: [] };
}
