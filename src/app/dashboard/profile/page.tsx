'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { UserCourse } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'Alex',
    email: 'alex@example.com',
    avatar: 'https://picsum.photos/seed/avatar/128/128',
  });
  const { toast } = useToast();

  const enrolledCourses: Omit<UserCourse, 'prompt' | 'modules' | 'completedModules'>[] = [
    {
      id: 'course-1',
      title: 'Introduction to React',
      progress: 60,
    },
    {
      id: 'course-2',
      title: 'Advanced Tailwind CSS',
      progress: 25,
    },
  ];
  
  const handleSaveChanges = () => {
    // In a real app, you would save the user data to your backend here.
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information.</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <Button>Change Photo</Button>
                <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
          </div>
           <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Enrolled Courses</CardTitle>
            <CardDescription>
                Here are the courses you are currently enrolled in.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {enrolledCourses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                        <Link href="/dashboard" className="font-semibold hover:underline">{course.title}</Link>
                    </div>
                    <div className="flex items-center gap-4 w-1/3">
                        <Progress value={course.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                </div>
            ))}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password here. It's a good practice to use a strong password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password"/>
            </div>
             <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password"/>
                </div>
                <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password"/>
                </div>
          </div>
           <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
