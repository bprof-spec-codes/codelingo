export interface Question {
  id: string;
  type: string;          
  language: string;
  difficulty: string;    
  title: string;
  questionText: string;
  explanation: string;
  tags: string;
  metadata: string;
  createdAt: string;     
  updatedAt: string;     
  createdBy: string;
  isActive: boolean;
}