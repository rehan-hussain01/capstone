
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
import { useAppContext } from '@/context/AppContext';
import type { User } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { setActiveUser, users } = useAppContext();
  const router = useRouter();

  const handleLogin = () => {
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      // In a real app, you'd also check the password.
      setActiveUser(existingUser);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${existingUser.name}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'No account found with that email.',
      });
    }
  };

  const handleGoogleLogin = () => {
     // This is a mock login. In a real app, this would use Firebase Auth.
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
        // In a real app, you would not need this logic.
        // This is just to ensure the default user exists for demo purposes.
        localStorage.setItem('users', JSON.stringify([...users, newUser])); 
        setActiveUser(newUser);
        router.push('/dashboard');
     }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo />
          </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
