export interface Question {
    questionId: string;
    text: string;
    choices?: string[];
    type: 'multiple-choice' | 'open-ended';
    answer?: string;  
    difficulty?: 'kolay' | 'orta' | 'zor'; // Zorluk seviyesi
    correctAnswer?: string; // Doğru cevap

  }
  

   
  