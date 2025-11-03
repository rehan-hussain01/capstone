import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/common/Logo";
import { ArrowRight, BookOpen, Bot, CheckCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI-Powered Course Generation",
    description: "Simply enter a topic, and our AI will generate a complete course syllabus with modules, lecture notes, and relevant YouTube videos.",
    image: PlaceHolderImages.find(p => p.id === 'feature-generation'),
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Interactive Quizzes",
    description: "Reinforce your learning with AI-generated multiple-choice quizzes for each module, tailored to the lecture notes.",
    image: PlaceHolderImages.find(p => p.id === 'feature-quizzes'),
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Progress Tracking",
    description: "Stay on top of your learning journey. Mark modules as complete and track your overall course progress.",
    image: PlaceHolderImages.find(p => p.id === 'feature-progress'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          {heroImage && (
             <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="absolute inset-0 h-full w-full object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="container relative z-10 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to <span className="text-primary">LearnVerse</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Your personal AI-powered learning platform. Generate comprehensive courses on any topic in minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 md:py-32 bg-secondary">
          <div className="container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Everything You Need to Learn, Faster
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                LearnVerse combines cutting-edge AI with proven learning techniques to create a personalized educational experience.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col overflow-hidden">
                  {feature.image && (
                     <div className="relative h-48 w-full">
                       <Image
                         src={feature.image.imageUrl}
                         alt={feature.image.description}
                         fill
                         className="object-cover"
                         data-ai-hint={feature.image.imageHint}
                       />
                     </div>
                  )}
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex items-center justify-between">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LearnVerse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
