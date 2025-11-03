
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserCourse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  courses: UserCourse[];
  setCourses: React.Dispatch<React.SetStateAction<UserCourse[]>>;
  isStateLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    name: 'Alex',
    email: 'alex@example.com',
    avatar: 'https://picsum.photos/seed/avatar/128/128',
  },
];

const initialCourses: UserCourse[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isStateLoading, setIsStateLoading] = useState(true);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => initialUsers);
  const [courses, setCourses] = useState<UserCourse[]>(() => initialCourses);

  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem('users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        window.localStorage.setItem('users', JSON.stringify(initialUsers));
      }

      const storedActiveUser = window.localStorage.getItem('activeUser');
      if (storedActiveUser) {
        setActiveUser(JSON.parse(storedActiveUser));
      }
      
      const storedCourses = window.localStorage.getItem('courses');
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to load data',
        description: 'There was an issue loading your saved data from local storage.',
      });
    } finally {
      setIsStateLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!isStateLoading) {
      try {
        window.localStorage.setItem('users', JSON.stringify(users));
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Failed to save users data',
          description: 'There was an issue persisting your user data.',
        });
      }
    }
  }, [users, isStateLoading, toast]);

  useEffect(() => {
    if (!isStateLoading) {
      try {
        if (activeUser) {
            window.localStorage.setItem('activeUser', JSON.stringify(activeUser));
        } else {
            window.localStorage.removeItem('activeUser');
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Failed to save active user',
          description: 'There was an issue persisting your session.',
        });
      }
    }
  }, [activeUser, isStateLoading, toast]);


  useEffect(() => {
    if (!isStateLoading) {
      try {
        window.localStorage.setItem('courses', JSON.stringify(courses));
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Failed to save courses',
          description: 'There was an issue persisting your course data.',
        });
      }
    }
  }, [courses, isStateLoading, toast]);

  const contextValue = {
    activeUser,
    setActiveUser,
    users,
    setUsers,
    courses,
    setCourses,
    isStateLoading,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
