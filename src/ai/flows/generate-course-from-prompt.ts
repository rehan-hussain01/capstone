
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
  prompt: `You are a course generator. Your ONLY task is to generate a course with 10-15 modules on the following topic: {{{$input}}}.

Each module must have a title, a relevant YouTube video link, and lecture notes.

CRITICAL: You MUST strictly adhere to the topic provided in the input. For example, if the input is "Hindi learning course", you MUST generate a course about learning Hindi. DO NOT generate a course on any other topic.

Your response MUST be a single, valid JSON object that conforms to the following structure:
{
  "modules": [
    {
      "title": "Module Title",
      "youtubeVideoLink": "https://www.youtube.com/watch?v=...",
      "lectureNotes": "Detailed notes for the module..."
    }
  ]
}
DO NOT include any other text, markdown formatting, or explanations outside of the JSON object.`,
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
    const {text} = await generateCoursePrompt(input);
    try {
        const parsedOutput = JSON.parse(text);
        return GenerateCourseFromPromptOutputSchema.parse(parsedOutput);
    } catch(e) {
        console.error("Failed to parse AI output:", e);
        console.error("Raw AI output:", text);
        // Fallback or error handling
        return { modules: [] };
    }
  }
);
