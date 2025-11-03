
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/common/Logo';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { useAppContext } from '@/context/AppContext';
import { AppProvider } from '@/context/AppContext';

function SignupPageContent() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { users, setUsers, setActiveUser } = useAppContext();

  const handleSignup = () => {
    if (!fullName || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields.',
      });
      return;
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      toast({
        variant: 'destructive',
        title: 'Account Exists',
        description: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    const newUser: User = {
      name: fullName,
      email: email,
      avatar: `https://picsum.photos/seed/${email}/128/128`,
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    setActiveUser(newUser);

    toast({
      title: 'Account Created!',
      description: 'You have been successfully signed up.',
    });

    router.push('/dashboard');
  };

  const handleGoogleSignup = () => {
    // This is a mock signup. In a real app, this would use Firebase Auth.
    const alexUser = users.find(u => u.email === 'alex@example.com');
    if (alexUser) {
       setActiveUser(alexUser);
       router.push('/dashboard');
    } else {
       const newUser: User = {
           name: 'Alex',
           email: 'alex@example.com',
           avatar: 'https://picsum.photos/seed/avatar/128/128',
       };
       setUsers(prevUsers => [...prevUsers, newUser]);
       setActiveUser(newUser);
       router.push('/dashboard');
    }
 };


  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="Max Robinson"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleSignup} className="w-full">
              Create an account
            </Button>
            <Button onClick={handleGoogleSignup} variant="outline" className="w-full">
              Sign up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SignupPage() {
  return (
      <SignupPageContent />
  )
}
