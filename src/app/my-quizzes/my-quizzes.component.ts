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
    this.loadSavedQuizzes();
  }

  loadSavedQuizzes() {
    const storedResults = localStorage.getItem('savedExams');
    this.quizzes = storedResults ? JSON.parse(storedResults) : [];
  }

  viewQuizDetails(quizId: string) {
    this.selectedQuizId = quizId;
    this.selectedQuiz = this.quizzes.find(quiz => quiz.id === quizId);

    // Doğru cevapları yüklemek için localStorage'dan verileri al
    if (this.selectedQuiz) {
      this.loadCorrectAnswers();
    }
  }

  loadCorrectAnswers() {
    const storedAnswers = localStorage.getItem('correctAnswers');
    if (storedAnswers) {
      this.correctAnswers = JSON.parse(storedAnswers);
    }
  }
}