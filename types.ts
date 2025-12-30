
export enum Step {
  Hero = 'Hero',
  LeadCapture = 'LeadCapture',
  Personality = 'Personality',
  FaceCapture = 'FaceCapture',
  ThemeSelection = 'ThemeSelection',
  ArtStyleSelection = 'ArtStyleSelection',
  Generating = 'Generating',
  Results = 'Results'
}

export interface UserData {
  fullName: string;
  role: string;
  email: string;
}

export interface PersonalityChoice {
  id: number;
  statement: string;
  label: string;
  description: string;
}

export interface Theme {
  id: string;
  label: string;
  description: string;
  emoji: string;
  mood: string;
  expression: string;
  category: 'regular' | 'modern';
}

export interface ArtStyle {
  id: string;
  label: string;
  description: string;
}

export interface GeneratedAvatar {
  url: string;
  theme: string;
  style: string;
  motivation: string;
  category: 'regular' | 'modern';
}
