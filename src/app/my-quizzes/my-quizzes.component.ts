import { Component, OnInit } from '@angular/core';
import { T3serviceService } from '../t3service.service';

interface Quiz {
  id: string;
  title: string;
  results: {
    questions: {
      questionId: string;
      text: string;
    }[];
    answers: { [key: string]: string };
  };
}

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrl: './my-quizzes.component.css'
})
export class MyQuizzesComponent implements OnInit {
  quizzes: any[] = [];
  selectedQuiz: any; // Seçilen quizin detaylarını saklamak için bir değişken
  examResults: any = {}; // Kullanıcının verdiği cevapları saklamak için
  correctAnswers: any = {}; // Doğru cevapları saklamak için

  constructor(private t3Service:T3serviceService) { }

  ngOnInit() {
    this.loadSavedQuizzes();
  }

  // LocalStorage'dan sınavları yükler
  loadSavedQuizzes() {
    const storedResults = localStorage.getItem('savedExams');
    if (storedResults) {
      this.quizzes = JSON.parse(storedResults);
    }
  }

  // Quiz'in detaylarını görüntülemek için
  viewQuizDetails(quizId: string) {
    this.selectedQuiz = this.quizzes.find(q => q.id === quizId);
  }

  // Prompt ile soruları LLM'e sor ve doğru cevapları al
  // Prompt ile soruları LLM'e sor ve doğru cevapları al
getCorrectAnswers() {
  let prompt = "Aşağıda verilen soruları ve cevapları gözden geçir ve doğru cevapları ver:\n\n";

  // Seçilen quiz'in soruları ve kullanıcının cevaplarını prompt'a ekle
  if (this.selectedQuiz && this.selectedQuiz.results.questions) {
    this.selectedQuiz.results.questions.forEach((question: any) => {
      const userAnswer = this.selectedQuiz.results.answers[question.questionId] || "Cevap yok";
      prompt += `Soru: ${question.text}\nKullanıcının Cevabı: ${userAnswer}\n\n`;
    });

    prompt += "Lütfen doğru cevapları ver.";

    // T3 servisine prompt'u gönder
    this.t3Service.sendPrompt(prompt).subscribe((response: any) => {
      this.correctAnswers = response.correctAnswers || {}; 
      console.log("Doğru Cevaplar:", this.correctAnswers);
    });
  }
}
}