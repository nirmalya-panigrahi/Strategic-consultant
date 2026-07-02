export interface Framework {
  id: string;
  name: string;
  category: string;
  visualType: string;
  elementCount: number;
  context: string[];
  description: string;
  purpose: string;
  guide: string;
}

export interface Question {
  type: 'category' | 'visualType' | 'elementCount' | 'tag';
  value: string | number;
  text: string;
}

export interface QuestionHistory {
  question: Question;
  answer: 'yes' | 'no' | 'dontKnow';
}
