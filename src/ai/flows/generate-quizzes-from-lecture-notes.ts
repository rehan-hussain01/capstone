
'use server';

/**
 * @fileOverview Generates multiple-choice quizzes from lecture notes.
 *
 * This file defines a Genkit flow that takes lecture notes as input and generates
 * a multiple-choice quiz with 5-8 questions.
 *
 * @exports generateQuizzesFromLectureNotes - The function to generate quizzes from lecture notes.
 * @exports GenerateQuizzesFromLectureNotesInput - The input type for the generateQuizzesFromLectureNotes function.
 * @exports GenerateQuizzesFromLectureNotesOutput - The output type for the generateQuizzesFromLectureNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizzesFromLectureNotesInputSchema = z.string().describe('The lecture notes to generate a quiz from.');
export type GenerateQuizzesFromLectureNotesInput = z.infer<typeof GenerateQuizzesFromLectureNotesInputSchema>;


const QuizQuestionSchema = z.object({
  question: z.string().describe("The quiz question."),
  options: z.array(z.string()).describe("An array of 4 multiple-choice options."),
  answer: z.string().describe("The correct answer from the options."),
});

const GenerateQuizzesFromLectureNotesOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe("An array of 5 to 8 quiz questions.")
});
export type GenerateQuizzesFromLectureNotesOutput = z.infer<typeof GenerateQuizzesFromLectureNotesOutputSchema>;


/**
 * Generates a multiple-choice quiz from lecture notes.
 * @param lectureNotes The lecture notes to generate a quiz from.
 * @returns The generated multiple-choice quiz.
 */
export async function generateQuizzesFromLectureNotes(lectureNotes: GenerateQuizzesFromLectureNotesInput): Promise<GenerateQuizzesFromLectureNotesOutput> {
  return generateQuizzesFromLectureNotesFlow(lectureNotes);
}

const generateQuizzesFromLectureNotesPrompt = ai.definePrompt({
  name: 'generateQuizzesFromLectureNotesPrompt',
  input: {schema: GenerateQuizzesFromLectureNotesInputSchema},
  output: {schema: GenerateQuizzesFromLectureNotesOutputSchema},
  prompt: `You are an expert quiz generator. Given a set of lecture notes, generate a multiple-choice quiz with 5 to 8 questions to test the user's understanding of the material. Each question must have 4 options.

Lecture Notes: {{{$input}}}`,
});

const generateQuizzesFromLectureNotesFlow = ai.defineFlow(
  {
    name: 'generateQuizzesFromLectureNotesFlow',
    inputSchema: GenerateQuizzesFromLectureNotesInputSchema,
    outputSchema: GenerateQuizzesFromLectureNotesOutputSchema,
  },
  async lectureNotes => {
    const {output} = await generateQuizzesFromLectureNotesPrompt(lectureNotes);
    return output!;
  }
);
