'use server';

/**
 * @fileOverview Generates multiple-choice quizzes from lecture notes.
 *
 * This file defines a Genkit flow that takes lecture notes as input and generates
 * a multiple-choice quiz.  The quiz is returned as a string.
 *
 * @example
 * // Example usage:
 * const quiz = await generateQuizzesFromLectureNotes("Lecture notes...");
 *
 * @exports generateQuizzesFromLectureNotes - The function to generate quizzes from lecture notes.
 * @exports GenerateQuizzesFromLectureNotesInput - The input type for the generateQuizzesFromLectureNotes function.
 * @exports GenerateQuizzesFromLectureNotesOutput - The output type for the generateQuizzesFromLectureNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizzesFromLectureNotesInputSchema = z.string().describe('The lecture notes to generate a quiz from.');
export type GenerateQuizzesFromLectureNotesInput = z.infer<typeof GenerateQuizzesFromLectureNotesInputSchema>;

const GenerateQuizzesFromLectureNotesOutputSchema = z.string().describe('The generated multiple-choice quiz.');
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
  prompt: `You are an expert quiz generator.  Given a set of lecture notes, generate a multiple-choice quiz to test the user's understanding of the material.\n\nLecture Notes: {{{$input}}}`,
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
