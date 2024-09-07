import { Component, OnInit } from '@angular/core';

interface Quiz {
  id: string;
  title: string;
  results: {
    questions: {
      questionId: string;
      text: string;
    }[];
    answers: { [key: string]: string };
    correctAnswers: { [key: string]: string }; // Doğru cevaplar
    explanations: { [key: string]: string };   

  };
}

@Component({
  selector: 'app-my-quizzes',
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css']
})
export class MyQuizzesComponent implements OnInit {
  quizzes: Quiz[] = [];
  selectedQuizId?: string;
  selectedQuiz?: Quiz;
  correctAnswers: { [questionId: string]: string } = {};

  constructor() { }

  ngOnInit() {
    this.selectedQuiz = {
      id: '1',
      title: 'Sample Quiz',
      results: {
        questions: [],
        answers: {},
        correctAnswers: {},
        explanations: {}
      }
    };

    this.loadSavedQuizzes();
  }

  loadSavedQuizzes() {
    const storedResults = localStorage.getItem('savedExams');
    this.quizzes = storedResults ? JSON.parse(storedResults) : [];
  }

  viewQuizDetails(quizId: string) {
    this.selectedQuizId = quizId;
    this.selectedQuiz = this.quizzes.find(quiz => quiz.id === quizId);
  
    if (this.selectedQuiz) {
      // Doğru cevaplar ve açıklamalar varsa yükleyin
      this.correctAnswers = this.selectedQuiz.results.correctAnswers || {};
      const explanations = this.selectedQuiz.results.explanations || {};
  
      // Burada explanations ve correctAnswers ile ilgili işlemleri yapabilirsiniz.
      console.log("Açıklamalar:", explanations);
      console.log("Doğru Cevaplar:", this.correctAnswers);
    }
  }

  loadCorrectAnswers() {
    const storedAnswers = localStorage.getItem('correctAnswers');
    if (storedAnswers) {
      this.correctAnswers = JSON.parse(storedAnswers);
    }
  }
}