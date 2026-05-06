export type BodyPart = 'head' | 'chest' | 'stomach';

export type EmoToken =
  | 'joy'
  | 'calm'
  | 'sad'
  | 'anxious'
  | 'ache'
  | 'tired'
  | 'itch';

export interface Suggestion {
  level: 1 | 2 | 3;
  emoji: string;
  title: string;
  detail: string;
}

export interface Symptom {
  id: string;
  label: string;
  guess: string;
  emoToken: EmoToken;
  metaphor: string;
  causes: string[];
  keywords: string[];
  suggestions: Suggestion[];
}

export interface FlowData {
  part: BodyPart;
  expression: string;
  symptom: Symptom;
  confirmedAfter: number;
}

export interface ChildProfile {
  name: string;
  gender: 'boy' | 'girl';
  age: number;
  medicalHistory: string[];
}

export interface HistoryEntry {
  id: string;
  part: BodyPart;
  expression: string;
  aiTag: string;
  date: string;
}
