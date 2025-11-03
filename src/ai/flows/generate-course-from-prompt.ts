
'use server';

/**
 * @fileOverview Generates a course syllabus, including module titles, YouTube video links, and lecture notes from a user prompt.
 *
 * - generateCourseFromPrompt - A function that handles the course generation process.
 * - GenerateCourseFromPromptInput - The input type for the generateCourseFromPrompt function.
 * - GenerateCourseFromPromptOutput - The return type for the generateCourseFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCourseFromPromptInputSchema = z.string().describe('The topic or prompt for the course.');
export type GenerateCourseFromPromptInput = z.infer<typeof GenerateCourseFromPromptInputSchema>;

const CourseModuleSchema = z.object({
  title: z.string().describe('The title of the module.'),
  youtubeVideoLink: z.string().describe('A link to a relevant YouTube video for the module.'),
  lectureNotes: z.string().describe('Lecture notes for the module.'),
});

const GenerateCourseFromPromptOutputSchema = z.object({
  modules: z.array(CourseModuleSchema).describe('An array of course modules.'),
});
export type GenerateCourseFromPromptOutput = z.infer<typeof GenerateCourseFromPromptOutputSchema>;

export async function generateCourseFromPrompt(
  input: GenerateCourseFromPromptInput
): Promise<GenerateCourseFromPromptOutput> {
  return generateCourseFromPromptFlow(input);
}

const generateCoursePrompt = ai.definePrompt({
  name: 'generateCoursePrompt',
  input: {schema: GenerateCourseFromPromptInputSchema},
  output: {schema: GenerateCourseFromPromptOutputSchema},
  prompt: `You are a curriculum designer. Given a topic, create a course syllabus with 10-15 modules. Each module must have a title, a relevant YouTube video link, and lecture notes.  Topic: {{{$input}}}`,
});

const generateCourseFromPromptFlow = ai.defineFlow(
  {
    name: 'generateCourseFromPromptFlow',
    inputSchema: GenerateCourseFromPromptInputSchema,
    outputSchema: GenerateCourseFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateCoursePrompt(input);
    return output!;
  }
);
