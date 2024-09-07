import { Component, OnInit } from '@angular/core';
import { Question } from '../models/question';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { T3serviceService } from '../t3service.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid'; // UUID kütüphanesini eklemelisiniz
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {

  quizForm!: FormGroup;
  numbers: number[] = [];
  pageTitle: string = "Mini Sınav Uygulaması";
  questions: Question[] = [];
  i: number = 0;
  interval: any;
  countdown: number = 0;
  countdownDisplay: string = '';
  examResults: { [questionId: string]: string } = {};
  quizId: string | undefined;
  quizTitle: string | undefined;
  correctAnswers: { [questionId: string]: string } = {};
  isExamFinished: boolean = false;
  userAnswers: { [key: string]: string } = {};
  explanations: { [key: string]: string } = {}; // Açıklamaları saklamak için bir değişken


  constructor(
    private fb: FormBuilder,
    private t3Service: T3serviceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setNumbers();
    this.initializeForm();
  }

  initializeForm() {
    this.quizForm = this.fb.group({
      ders: ['', Validators.required],
      soruStili: ['', Validators.required],
      zorluk: ['', Validators.required],
      soruSayisi: ['', Validators.required]
    });
  }

  startCountdown() {
    this.updateCountdownDisplay();

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.updateCountdownDisplay();

        if (this.countdown === 10) {
          this.saveExamResults();
        }
      } else {
        clearInterval(this.interval);
        this.isExamFinished = true;
        alert("Süreniz doldu! Sınav tamamlandı.");
      }
    }, 1000);
  }

  clearQuestions() {
    this.questions = [];
  }

  updateCountdownDisplay() {
    const minutes: number = Math.floor(this.countdown / 60);
    const seconds: number = this.countdown % 60;
    this.countdownDisplay = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  onQuizGenerate() {
    this.clearQuestions();
    this.isExamFinished = false;
    console.log('Form:', this.quizForm.value);
    if (this.quizForm.valid) {
      const formValues = this.quizForm.value;
      const input = `${formValues.ders} dersinden ${formValues.soruSayisi} adet ${formValues.zorluk} zorlukta ${formValues.soruStili} soru oluştur.`;

      this.t3Service.generateQuiz(formValues).subscribe(
        (response: any) => {
          console.log('API Cevabı:', response);

          this.handleResponse(response);
          this.questions = this.parseQuizQuestions(response);
          const toplamSure = this.calculateTotalTime(this.questions);
          this.countdown = toplamSure;
          this.startCountdown();

          this.getCorrectAnswers();
        },
        (error: any) => {
          console.error('API Hatası:', error);
        }
      );
    } else {
      this.snackBar.open('Formu doğru doldurun!', 'Kapat', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  getCorrectAnswers() {
    return new Promise<void>((resolve) => {
      let count = 0;
      const totalQuestions = this.questions.length;
  
      this.questions.forEach(question => {
        let prompt = `Aşağıdaki sorunun doğru cevabını verin:\n\n`;
        prompt += `Soru: ${question.text}\n`;
  
        this.t3Service.sendPrompt(prompt).subscribe((response: any) => {
          console.log('Response:', response);
  
          let answerText = response;  // Yanıt metnini doğrudan alıyoruz
          this.correctAnswers[question.questionId] = answerText;
  
          count++;
          if (count === totalQuestions) {
            resolve(); // Tüm sorular işlendikten sonra resolve et
          }
        });
      });
    });
  }

  calculateTotalTime(questions: Question[]): number {
    let totalTime = 0;

    questions.forEach(question => {
      switch (question.difficulty) {
        case 'kolay':
          totalTime += 30;
          break;
        case 'orta':
          totalTime += 60;
          break;
        case 'zor':
          totalTime += 120;
          break;
        default:
          totalTime += 30;
      }
    });

    return totalTime;
  }

  handleResponse(response: any) {
    console.log('Oluşan Quiz:', response);
  }

  parseQuizQuestions(response: string): Question[] {
    console.log('Raw Response for Parsing:', response);

    const lines = response.split('\n').filter(line => line.trim() !== '');
    const questions: Question[] = lines.map((text: string) => ({
      questionId: uuidv4(),
      text: text.replace(/\"/g, '').trim(),
      type: 'open-ended'
    }));

    console.log('Parsed Questions:', questions);
    return questions;
  }

  setNumbers(): void {
    for (let i = 1; i <= 20; i++) {
      this.numbers.push(i);
    }
  }

  async finishExam() {
    this.isExamFinished = true;
    clearInterval(this.interval);
    console.log('Toplanan Cevaplar:', this.userAnswers);

    // Doğru cevapları ve kullanıcı cevaplarını gönderip açıklama al
    await this.provideExplanationForAnswers();
  }

  async provideExplanationForAnswers() {
    for (const [questionId, userAnswer] of Object.entries(this.userAnswers)) {
      const correctAnswer = this.correctAnswers[questionId];
      const prompt = `
        Sorunun doğru cevabı: ${correctAnswer}
        Kullanıcının cevabı: ${userAnswer}
        Öğrenciye bu iki cevabı karşılaştırarak nasıl doğru cevabı anlayabileceğini açıklayın.
      `;

      this.t3Service.sendPrompt(prompt).subscribe((response: any) => {
        console.log(`Açıklama (Soru ID: ${questionId}):`, response);
        this.explanations[questionId] = response; // Açıklamayı saklayın
      });
    }
  }
  saveExamResults() {
    console.log('Cevaplar:', this.userAnswers);
  
    if (!this.userAnswers || Object.keys(this.userAnswers).length === 0) {
      console.log('Cevaplar eksik veya boş!');
      return;
    }
  
    const resultsToSave = {
      id: this.quizId || uuidv4(),
      title: this.quizTitle || 'Yeni Quiz',
      results: {
        questions: this.questions,
        answers: this.userAnswers,
        correctAnswers: this.correctAnswers
      }
    };
  
    console.log('Kaydedilecek Cevaplar:', JSON.stringify(resultsToSave, null, 2));
    this.saveExamResultsToStorage(resultsToSave,this.correctAnswers);
  }

  saveExamResultsToStorage(results: any, correctAnswers: any) {
    try {
      // Sınav sonuçlarını kaydetme
      const storedResults = localStorage.getItem('savedExams');
      let savedExams = storedResults ? JSON.parse(storedResults) : [];
      
      if (!Array.isArray(savedExams)) {
        savedExams = [];
      }
  
      savedExams.push(results);
      localStorage.setItem('savedExams', JSON.stringify(savedExams));
  
      // Doğru cevapları kaydetme
      localStorage.setItem('correctAnswers', JSON.stringify(correctAnswers));
    } catch (error) {
      console.error('LocalStorage hatası:', error);
      // Hata yönetimi için uygun bir strateji ekleyin
    }
  }
  collectAnswer(questionId: string, event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const answer = textarea.value;

    this.userAnswers[questionId] = answer;
    console.log('Cevap Kaydedildi:', this.examResults);
  }
}