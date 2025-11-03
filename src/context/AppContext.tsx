'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserCourse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  courses: UserCourse[];
  setCourses: React.Dispatch<React.SetStateAction<UserCourse[]>>;
  isStateLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUser: User = {
  name: 'Alex',
  email: 'alex@example.com',
  avatar: 'https://picsum.photos/seed/avatar/128/128',
};

const initialCourses: UserCourse[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isStateLoading, setIsStateLoading] = useState(true);
  const [user, setUser] = useState<User>(() => initialUser);
  const [courses, setCourses] = useState<UserCourse[]>(() => initialCourses);

  useEffect(() => {
    // This effect runs once on mount to load data from localStorage.
    try {
      const storedUser = window.localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const storedCourses = window.localStorage.getItem('courses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to load data",
        description: "There was an issue loading your saved data from local storage."
      });
    } finally {
        setIsStateLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    // This effect runs whenever user state changes, but not on the initial load.
    if(!isStateLoading) {
        try {
          window.localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Failed to save user data",
                description: "There was an issue persisting your profile data."
            })
        }
    }
  }, [user, isStateLoading, toast]);

  useEffect(() => {
    // This effect runs whenever courses state changes, but not on the initial load.
    if(!isStateLoading) {
        try {
            window.localStorage.setItem('courses', JSON.stringify(courses));
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Failed to save courses",
                description: "There was an issue persisting your course data."
            })
        }
    }
  }, [courses, isStateLoading, toast]);


  return (
    <AppContext.Provider value={{ user, setUser, courses, setCourses, isStateLoading }}>
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
