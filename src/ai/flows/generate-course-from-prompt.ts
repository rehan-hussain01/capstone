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
  progress: z.string().describe('A short summary of course generation progress.'),
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
  prompt: `You are an AI course generator. Generate a course syllabus based on the following prompt: {{{$input}}}. The course should contain multiple modules. Each module must have a title, a relevant YouTube video link, and lecture notes. Format the output as a JSON object that matches the GenerateCourseFromPromptOutputSchema schema. Do not include any text other than the JSON object in your response. Provide a progress summary in the 'progress' field.

Ensure the YouTube video links are valid and directly related to the module content. The lecture notes should be detailed and comprehensive, covering the key concepts of each module.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
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
