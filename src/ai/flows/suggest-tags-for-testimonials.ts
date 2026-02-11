
// 'use server'; // Not compatible with static export

import { z } from 'zod'; // Use client-side zod

const SuggestTagsForTestimonialInputSchema = z.object({
  testimonialText: z.string().describe('The text content of the testimonial.'),
});
export type SuggestTagsForTestimonialInput = z.infer<typeof SuggestTagsForTestimonialInputSchema>;

const SuggestTagsForTestimonialOutputSchema = z.object({
  suggestedTags: z.array(z.string()).describe('An array of suggested tags for the testimonial.'),
});
export type SuggestTagsForTestimonialOutput = z.infer<typeof SuggestTagsForTestimonialOutputSchema>;

export async function suggestTagsForTestimonial(input: SuggestTagsForTestimonialInput): Promise<SuggestTagsForTestimonialOutput> {
  console.warn("AI suggestions are disabled in static export mode.");
  return { suggestedTags: [] };
}
