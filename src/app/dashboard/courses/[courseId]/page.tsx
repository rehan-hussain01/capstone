
'use client';

import React from 'react';
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
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Check, Youtube } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';

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

  const course = courses.find((c) => c.id === courseId);

  const handleModuleCompletion = (moduleId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(c => {
        if (c.id === courseId) {
          const completedModules = c.completedModules.includes(moduleId)
            ? c.completedModules.filter(id => id !== moduleId)
            : [...c.completedModules, moduleId];
          
          const progress = Math.round((completedModules.length / c.modules.length) * 100);

          return { ...c, completedModules, progress };
        }
        return c;
      })
    );
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
                <AccordionContent className="pl-12">
                   <div className="prose prose-sm dark:prose-invert max-w-none">
                     {videoId && (
                      <div className="aspect-video mb-6">
                        <iframe
                          className="w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><BookOpen size={18} /> Lecture Notes</h4>
                    <div dangerouslySetInnerHTML={{ __html: module.lectureNotes.replace(/\n/g, '<br />') }} />
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
