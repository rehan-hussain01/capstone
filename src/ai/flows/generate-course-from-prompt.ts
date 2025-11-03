
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
  prompt: `You are a course generator. Generate a course with 10-15 modules on the following topic: {{{$input}}}.

Each module must have a title, a relevant YouTube video link, and lecture notes.

It is absolutely critical that you strictly adhere to the programming language or topic specified in the prompt. For example, if the prompt is for "Java", you must ONLY generate Java-related content. If the prompt is "NCERT class 9th mathematics", you MUST ONLY generate content for that specific curriculum. If the prompt is about "English speaking", you MUST ONLY generate content related to learning English. Under NO circumstances should you include content from other topics like "Python" if it was not requested.

Your response must be ONLY the JSON object matching the output schema. Do not include any other text or markdown.`,
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
