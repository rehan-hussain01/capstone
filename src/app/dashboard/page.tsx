
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, BookOpen, Book, Youtube, ListChecks, ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { UserCourse } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateCourseFromPrompt, GenerateCourseFromPromptOutput } from '@/ai/flows/generate-course-from-prompt';


export default function DashboardPage() {
  const [courses, setCourses] = React.useState<UserCourse[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newCoursePrompt, setNewCoursePrompt] = React.useState('');
  const { toast } = useToast();

  const handleCreateCourse = async () => {
    if (!newCoursePrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a topic for your new course.',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await generateCourseFromPrompt(newCoursePrompt);
      if (result && result.modules) {
        const newCourse: UserCourse = {
          id: `course-${Date.now()}`,
          title: newCoursePrompt.split(' ').slice(0, 5).join(' '),
          prompt: newCoursePrompt,
          modules: result.modules,
          progress: 0,
          completedModules: [],
        };
        setCourses(prevCourses => [...prevCourses, newCourse]);
        toast({
          title: 'Course Generated!',
          description: `Your new course "${newCourse.title}" has been created.`,
        });
        setNewCoursePrompt(''); 
      } else {
        throw new Error('Invalid response from AI.');
      }
    } catch (error) {
      console.error('Failed to generate course:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'There was an issue creating your course. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const coursePlaceholder1 = PlaceHolderImages.find(p => p.id === 'course-placeholder-1');
  const coursePlaceholder2 = PlaceHolderImages.find(p => p.id === 'course-placeholder-2');


  return (
    <>
       <div className="mb-8">
        <Card className="bg-background shadow-sm border-border">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create a New Course</CardTitle>
            <CardDescription>
              Describe the course you want to create, and our AI will generate it for you in seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                placeholder="e.g., 'An introduction to quantum physics for beginners'"
                value={newCoursePrompt}
                onChange={(e) => setNewCoursePrompt(e.target.value)}
                disabled={isLoading}
                className="min-h-[100px] pr-28 resize-none"
              />
              <Button onClick={handleCreateCourse} disabled={isLoading} size="sm" className="absolute right-3 bottom-3">
                {isLoading ? 'Generating...' : <>
                  <PlusCircle className="mr-2" />
                  Generate
                </>}
              </Button>
            </div>
            {isLoading && <Progress value={undefined} className="mt-4 h-1 animate-pulse" />}
          </CardContent>
        </Card>
      </div>

      <div>
        {(courses.length === 0 && !isLoading) ? (
           <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Start your Learning Journey
              </h3>
              <p className="text-sm text-muted-foreground">
                You have no courses yet. Generate your first course to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
             {courses.map((course) => (
              <Card key={course.id} className="flex flex-col bg-background shadow-sm border-border hover:shadow-md transition-shadow">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="relative h-24 w-24 flex-shrink-0">
                   <Image
                      src={coursePlaceholder1?.imageUrl || ''}
                      alt={coursePlaceholder1?.description || ''}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint={coursePlaceholder1?.imageHint}
                    />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-headline mb-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">{course.prompt}</CardDescription>
                    <div className="mt-2 flex items-center text-xs text-muted-foreground space-x-2">
                       <div className="flex items-center gap-1">
                        <Book size={14} />
                        <span>{course.modules.length} Modules</span>
                       </div>
                       <div className="flex items-center gap-1">
                        <Youtube size={14} />
                        <span>{course.modules.length} Videos</span>
                       </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{course.progress}% complete</span>
                      <span className="text-muted-foreground">{course.completedModules.length} of {course.modules.length} completed</span>
                    </div>
                    <Progress value={course.progress} className="h-2"/>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Continue Learning
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Example Courses */}
             <Card className="flex flex-col bg-background shadow-sm border-border hover:shadow-md transition-shadow">
               <CardHeader className="flex-row items-start gap-4 space-y-0">
                 {coursePlaceholder1 && (
                   <div className="relative h-24 w-24 flex-shrink-0">
                     <Image
                        src={coursePlaceholder1.imageUrl}
                        alt={coursePlaceholder1.description}
                        fill
                        className="object-cover rounded-md"
                        data-ai-hint={coursePlaceholder1.imageHint}
                      />
                   </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-headline mb-1">Introduction to React</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">Learn the fundamentals of React for building modern web applications.</CardDescription>
                     <div className="mt-2 flex items-center text-xs text-muted-foreground space-x-2">
                       <div className="flex items-center gap-1">
                        <Book size={14} />
                        <span>10 Modules</span>
                       </div>
                       <div className="flex items-center gap-1">
                        <Youtube size={14} />
                        <span>10 Videos</span>
                       </div>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="flex-1">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">60% complete</span>
                      <span className="text-muted-foreground">6 of 10 completed</span>
                    </div>
                    <Progress value={60} className="h-2"/>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full">
                    Continue Learning
                  </Button>
              </CardFooter>
            </Card>
             <Card className="flex flex-col bg-background shadow-sm border-border hover:shadow-md transition-shadow">
               <CardHeader className="flex-row items-start gap-4 space-y-0">
                 {coursePlaceholder2 && (
                   <div className="relative h-24 w-24 flex-shrink-0">
                     <Image
                        src={coursePlaceholder2.imageUrl}
                        alt={coursePlaceholder2.description}
                        fill
                        className="object-cover rounded-md"
                        data-ai-hint={coursePlaceholder2.imageHint}
                      />
                   </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-lg font-headline mb-1">Advanced Tailwind CSS</CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">Master advanced techniques and best practices in Tailwind CSS.</CardDescription>
                     <div className="mt-2 flex items-center text-xs text-muted-foreground space-x-2">
                       <div className="flex items-center gap-1">
                        <Book size={14} />
                        <span>8 Modules</span>
                       </div>
                       <div className="flex items-center gap-1">
                        <Youtube size={14} />
                        <span>8 Videos</span>
                       </div>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="flex-1">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">25% complete</span>
                      <span className="text-muted-foreground">2 of 8 completed</span>
                    </div>
                    <Progress value={25} className="h-2"/>
                  </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full">
                    Continue Learning
                  </Button>
              </CardFooter>
            </Card>

          </div>
        )}
      </div>
    </>
  );
}
