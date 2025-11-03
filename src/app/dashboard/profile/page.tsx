
'use client';

import { useState, useEffect } from 'react';
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
import type { User } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cartoonAvatars } from '@/lib/avatars';
import Image from 'next/image';

export default function ProfilePage() {
  const { activeUser, setActiveUser, courses, isStateLoading } = useAppContext();
  const [localUser, setLocalUser] = useState<User | null>(activeUser);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalUser(activeUser);
  }, [activeUser]);
  
  const handleSaveChanges = () => {
    if (localUser) {
      setActiveUser(localUser);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      });
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    if (localUser) {
      const updatedUser = { ...localUser, avatar: avatarUrl };
      setLocalUser(updatedUser);
      setActiveUser(updatedUser);
      toast({
        title: 'Photo Changed',
        description: 'Your profile photo has been updated.',
      });
      setIsAvatarDialogOpen(false);
    }
  };


  if (isStateLoading || !localUser) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Separator />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-56 w-full" />
        </div>
    )
  }

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
              <AvatarImage src={localUser.avatar} alt={localUser.name} />
              <AvatarFallback>{localUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Change Photo</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Choose your Avatar</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {cartoonAvatars.map((avatar, index) => (
                        <button 
                          key={index}
                          className="rounded-full overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none"
                          onClick={() => handleAvatarSelect(avatar)}
                        >
                          <Image
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <p className="text-xs text-muted-foreground">Select a new avatar.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={localUser.name} 
                onChange={(e) => setLocalUser({...localUser, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={localUser.email}
                onChange={(e) => setLocalUser({...localUser, email: e.target.value})}
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
            {courses.length > 0 ? courses.map(course => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                        <Link href={`/dashboard/courses/${course.id}`} className="font-semibold hover:underline">{course.title}</Link>
                    </div>
                    <div className="flex items-center gap-4 w-1/3">
                        <Progress value={course.progress} className="h-2" />
                        <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center">You are not enrolled in any courses yet.</p>
            )}
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
