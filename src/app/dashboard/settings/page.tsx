
'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';


export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { activeUser, users, setUsers, setActiveUser, setCourses } = useAppContext();
  const [confirmationText, setConfirmationText] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    if (!activeUser) return;

    // Remove user from users list
    setUsers(users.filter(user => user.email !== activeUser.email));
    
    // Clear active user
    setActiveUser(null);

    // Clear all courses associated with the user (in this simple setup, we clear all courses)
    // In a multi-user app, you'd filter courses by userId
    setCourses([]);
    
    toast({
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted.',
    });

    // Redirect to login
    router.push('/login');
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences and settings.
        </p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Email Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Receive emails about course updates and new features.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center space-x-4 rounded-md border p-4">
             <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Get push notifications on your devices.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-2">
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <Label htmlFor="dark-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
             Enable Dark Mode
            </Label>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
            <CardTitle className="text-destructive">Delete Account</CardTitle>
            <CardDescription>
                Permanently delete your account and all of your content. This action is not reversible.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete My Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. Please type <strong>delete</strong> to confirm.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                    <Input 
                        id="delete-confirm"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder='delete'
                    />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmationText('')}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={confirmationText !== 'delete'}
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
       </Card>
    </div>
  );
}
