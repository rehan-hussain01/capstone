'use client';

import React from 'react';
import Image from 'next/image';
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
import { PlusCircle, BookOpen } from 'lucide-react';
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
          title: newCoursePrompt.split(' ').slice(0, 5).join(' '), // Generate a title from prompt
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
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Course</CardTitle>
            <CardDescription>
              Describe the course you want to create, and our AI will generate it for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Textarea
                placeholder="e.g., 'An introduction to quantum physics for beginners'"
                value={newCoursePrompt}
                onChange={(e) => setNewCoursePrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateCourse} disabled={isLoading}>
              {isLoading ? 'Generating...' : <>
                <PlusCircle className="mr-2" />
                Generate Course
              </>}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold font-headline">My Courses</h2>
        {courses.length === 0 && !isLoading ? (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Courses Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by generating your first course above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {courses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                 <div className="relative h-48 w-full">
                   <Image
                      src={coursePlaceholder1?.imageUrl || ''}
                      alt={coursePlaceholder1?.description || ''}
                      fill
                      className="object-cover"
                      data-ai-hint={coursePlaceholder1?.imageHint}
                    />
                 </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.modules.length} modules</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <Progress value={course.progress} />
                    <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Continue Learning</Button>
                </CardFooter>
              </Card>
            ))}

            {/* Example Courses */}
             <Card className="flex flex-col">
               {coursePlaceholder1 && (
                 <div className="relative h-48 w-full">
                   <Image
                      src={coursePlaceholder1.imageUrl}
                      alt={coursePlaceholder1.description}
                      fill
                      className="object-cover"
                      data-ai-hint={coursePlaceholder1.imageHint}
                    />
                 </div>
                )}
              <CardHeader>
                <CardTitle>Introduction to React</CardTitle>
                <CardDescription>10 modules</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <Progress value={60} />
                  <p className="text-sm text-muted-foreground">60% complete</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Learning</Button>
              </CardFooter>
            </Card>
             <Card className="flex flex-col">
               {coursePlaceholder2 && (
                 <div className="relative h-48 w-full">
                   <Image
                      src={coursePlaceholder2.imageUrl}
                      alt={coursePlaceholder2.description}
                      fill
                      className="object-cover"
                      data-ai-hint={coursePlaceholder2.imageHint}
                    />
                 </div>
                )}
              <CardHeader>
                <CardTitle>Advanced Tailwind CSS</CardTitle>
                <CardDescription>8 modules</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <Progress value={25} />
                  <p className="text-sm text-muted-foreground">25% complete</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Learning</Button>
              </CardFooter>
            </Card>

          </div>
        )}
      </div>
    </main>
  );
}
