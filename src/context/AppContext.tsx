'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserCourse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  courses: UserCourse[];
  setCourses: React.Dispatch<React.SetStateAction<UserCourse[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUser: User = {
  name: 'Alex',
  email: 'alex@example.com',
  avatar: 'https://picsum.photos/seed/avatar/128/128',
};

const initialCourses: UserCourse[] = [
    {
      id: 'course-1',
      title: 'Introduction to React',
      prompt: 'Learn the fundamentals of React for building modern web applications.',
      modules: [],
      progress: 60,
      completedModules: [],
    },
    {
      id: 'course-2',
      title: 'Advanced Tailwind CSS',
      prompt: 'Master advanced techniques and best practices in Tailwind CSS.',
      modules: [],
      progress: 25,
      completedModules: [],
    },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  const [user, setUser] = useState<User>(() => {
    if (typeof window === 'undefined') return initialUser;
    try {
      const item = window.localStorage.getItem('user');
      return item ? JSON.parse(item) : initialUser;
    } catch (error) {
      console.error(error);
      return initialUser;
    }
  });
  
  const [courses, setCourses] = useState<UserCourse[]>(() => {
    if (typeof window === 'undefined') return initialCourses;
    try {
      const item = window.localStorage.getItem('courses');
      return item ? JSON.parse(item) : initialCourses;
    } catch (error) {
      console.error(error);
      return initialCourses;
    }
  });
  
  useEffect(() => {
    try {
      window.localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to save user data",
            description: "There was an issue persisting your profile data."
        })
    }
  }, [user, toast]);

  useEffect(() => {
    try {
        window.localStorage.setItem('courses', JSON.stringify(courses));
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Failed to save courses",
            description: "There was an issue persisting your course data."
        })
    }
  }, [courses, toast]);


  return (
    <AppContext.Provider value={{ user, setUser, courses, setCourses }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
