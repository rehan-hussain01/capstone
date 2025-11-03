
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Book, Youtube, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { UserCourse } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateCourseFromPrompt } from '@/ai/flows/generate-course-from-prompt';
import { useAppContext } from '@/context/AppContext';


export default function DashboardPage() {
  const { courses, setCourses } = useAppContext();
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

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    toast({
      title: 'Course Deleted',
      description: 'The course has been successfully removed.',
    });
  };


  const coursePlaceholder1 = PlaceHolderImages.find(p => p.id === 'course-placeholder-1');


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
           <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-12">
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
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the course "{course.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCourse(course.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
          </div>
        )}
      </div>
    </>
  );
}
