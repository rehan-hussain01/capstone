
'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Check, Youtube, Lightbulb, Bot, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateQuizzesFromLectureNotes } from '@/ai/flows/generate-quizzes-from-lecture-notes';
import type { Quiz } from '@/lib/types';


function getYouTubeVideoId(url: string) {
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (
      urlObj.hostname === 'www.youtube.com' ||
      urlObj.hostname === 'youtube.com'
    ) {
      videoId = urlObj.searchParams.get('v') || '';
    }
  } catch (error) {
    console.error("Invalid YouTube URL:", url);
    return null;
  }
  return videoId;
}


export default function CoursePage() {
  const { courseId } = useParams();
  const { courses, setCourses, isStateLoading } = useAppContext();
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const { toast } = useToast();

  const course = courses.find((c) => c.id === courseId);

  const handleModuleCompletion = (moduleId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(c => {
        if (c.id === courseId) {
          const completedModules = c.completedModules.includes(moduleId)
            ? c.completedModules.filter(id => id !== moduleId)
            : [...c.completedModules, moduleId];
          
          const progress = c.modules.length > 0 ? Math.round((completedModules.length / c.modules.length) * 100) : 0;

          return { ...c, completedModules, progress };
        }
        return c;
      })
    );
  };

  const handleGenerateQuiz = async (lectureNotes: string) => {
    setIsGeneratingQuiz(true);
    setQuiz(null);
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    try {
      const quizResult = await generateQuizzesFromLectureNotes(lectureNotes);
      setQuiz(quizResult);
      toast({
        title: 'Quiz Generated!',
        description: 'Your quiz is ready to be taken.',
      });
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      toast({
        variant: 'destructive',
        title: 'Quiz Generation Failed',
        description: 'There was an issue creating the quiz. Please try again.',
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };
  
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
  };

  const getQuizScore = () => {
    if (!quiz) return { score: 0, total: 0 };
    const correctAnswers = quiz.questions.reduce((acc, question, index) => {
      if (selectedAnswers[index] === question.answer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { score: correctAnswers, total: quiz.questions.length };
  };
  
  if (isStateLoading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                  </div>
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-96 w-full" />
          </div>
      )
  }

  if (!course) {
    return notFound();
  }
  
  const { score, total } = getQuizScore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
           <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold font-headline">{course.title}</h1>
            <p className="text-muted-foreground">{course.prompt}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Course Progress</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium">{course.progress}% complete</span>
                <span className="text-muted-foreground">{course.completedModules.length} of {course.modules.length} completed</span>
            </div>
            <Progress value={course.progress} className="h-2"/>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Course Modules</CardTitle>
          <CardDescription>Work your way through the modules to complete the course.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {course.modules.map((module, index) => {
               const videoId = getYouTubeVideoId(module.youtubeVideoLink);
               const isCompleted = course.completedModules.includes(module.title);
              
              return (
              <AccordionItem value={`item-${index}`} key={index}>
                <div className="flex items-center gap-4">
                    <Checkbox 
                      id={`module-${index}`} 
                      checked={isCompleted}
                      onCheckedChange={() => handleModuleCompletion(module.title)}
                    />
                    <AccordionTrigger className="flex-1">
                      <div className="flex items-center gap-3">
                         {isCompleted && <Check className="h-5 w-5 text-green-500" />}
                        <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                          {module.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                </div>
                <AccordionContent className="pl-12 space-y-6">
                   <div className="prose prose-sm dark:prose-invert max-w-none">
                     {videoId && (
                      <div className="aspect-video mb-6">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><BookOpen size={18} /> Lecture Notes</h4>
                    <div dangerouslySetInnerHTML={{ __html: module.lectureNotes.replace(/\n/g, '<br />') }} />
                   </div>
                   
                   <Separator />

                   <div>
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-lg flex items-center gap-2"><Lightbulb size={18}/> Module Quiz</CardTitle>
                      <CardDescription>Test your knowledge from the lecture notes.</CardDescription>
                    </CardHeader>
                    
                    {isGeneratingQuiz ? (
                       <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                         <Bot className="h-5 w-5" />
                         <p>Generating your quiz...</p>
                       </div>
                    ) : !quiz ? (
                      <Button onClick={() => handleGenerateQuiz(module.lectureNotes)}>
                        Generate Quiz
                      </Button>
                    ) : (
                      <div className="space-y-6">
                         {submittedQuiz && (
                          <Card className={`p-4 ${score / total >= 0.7 ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-red-100 dark:bg-red-900/50 border-red-500'}`}>
                            <CardHeader className="p-0">
                              <CardTitle className="text-base">Quiz Result: {score} out of {total} correct ({Math.round((score/total)*100)}%)</CardTitle>
                            </CardHeader>
                          </Card>
                         )}
                        {quiz.questions.map((q, qIndex) => (
                           <div key={qIndex} className="space-y-3">
                             <p className="font-medium flex items-start gap-2">
                               <span>{qIndex + 1}.</span> {q.question}
                             </p>
                             <RadioGroup 
                              onValueChange={(value) => handleAnswerChange(qIndex, value)}
                              value={selectedAnswers[qIndex]}
                              disabled={submittedQuiz}
                             >
                               {q.options.map((option, oIndex) => {
                                  const isCorrect = submittedQuiz && option === q.answer;
                                  const isSelected = selectedAnswers[qIndex] === option;
                                  const isIncorrect = submittedQuiz && isSelected && option !== q.answer;
                                  
                                  return (
                                     <div key={oIndex} className={`flex items-center space-x-2 p-2 rounded-md ${isCorrect ? 'bg-green-100 dark:bg-green-900' : ''} ${isIncorrect ? 'bg-red-100 dark:bg-red-900' : ''}`}>
                                        <RadioGroupItem value={option} id={`q${qIndex}-o${oIndex}`} />
                                        <Label htmlFor={`q${qIndex}-o${oIndex}`} className="flex-1 cursor-pointer">{option}</Label>
                                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                        {isIncorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                    </div>
                                  )
                               })}
                             </RadioGroup>
                           </div>
                         ))}
                        <Button onClick={handleSubmitQuiz} disabled={submittedQuiz}>Submit Quiz</Button>
                      </div>
                    )}
                   </div>
                </AccordionContent>
              </AccordionItem>
            )})}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
