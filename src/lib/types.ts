export interface Module {
  title: string;
  youtubeVideoLink: string;
  lectureNotes: string;
}

export interface Course {
  id: string;
  title: string;
  prompt: string;
  modules: Module[];
}

export interface UserCourse extends Course {
  progress: number;
  completedModules: string[]; // array of module titles
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string; // The correct option text
}

export interface Quiz {
  questions: QuizQuestion[];
}
