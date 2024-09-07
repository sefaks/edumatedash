import { Component, ElementRef, ViewChild } from '@angular/core';
import { T3serviceService } from '../t3service.service';
import { forkJoin } from 'rxjs';
import { AnswerEvaluationService } from '../answer-evaluation.service';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']  
})
export class ExplanationComponent {

  loading: boolean = false;
  prompt: string = '';  
  chatHistory: any[] = [];  
  results: any[] = [];  
  promptResponse: any;
  errorMessage: string = '';
  userAnswer: string = '';  
  waitingForAnswer: boolean = false;  
  @ViewChild('chatHistoryContainer', { static: false }) chatHistoryContainer!: ElementRef;

  title = 'Explanation Component';

  constructor(private t3Service: T3serviceService,private answerEvaluationService: AnswerEvaluationService) {
    this.t3Service.messageHistory.subscribe((history) => {
      this.chatHistory = history;
    });
  }

  ngOnInit(): void {}

  async sendData() {
    if (!this.prompt.trim()) {
      return;
    }

    this.loading = true;
    this.chatHistory.push({ from: 'user', message: this.prompt });
    this.fetchAndSendData(this.prompt);
  }

  fetchAndSendData(query: string) {
    this.t3Service.getEduRag(query)
      .subscribe(response => {
        this.results = response.rag_result;
        console.log('Veri alındı:', this.results);
  
        const groupedResults = this.groupResults(this.results, 3);
        this.processGroup(0, groupedResults);
        
      }, error => {
        this.errorMessage = 'Veri çekme hatası: ' + error.message;
        console.error('Error:', error);
        this.loading = false;
      });
  }

  groupResults(results: string[], groupSize: number): string[][] {
    const grouped: string[][] = [];
    for (let i = 0; i < results.length; i += groupSize) {
      grouped.push(results.slice(i, i + groupSize));
    }
    return grouped;
  }

  processGroup(index: number, groupedResults: string[][]) {
    if (index >= groupedResults.length) {
      this.loading = false;
      this.prompt = '';
      return;
    }
  
    const group = groupedResults[index];
    const modifiedPrompt = this.createPromptFromResults(group);
  
    // Özetleme isteği
    this.t3Service.sendPrompt(modifiedPrompt)
      .subscribe(response => {
        this.chatHistory.push({ from: 'assistant', message: response });
        console.log('Özet yanıtı:', response);

        // Özet yanıtına dayalı soru isteği
        this.askQuestionBasedOnSummary(response, index, groupedResults);
  
      }, error => {
        this.errorMessage = 'Özet gönderme hatası: ' + error.message;
        console.error('Error:', error);
        this.loading = false;
      });
  }

 

  createPromptFromResults(results: string[]): string {
    if (!Array.isArray(results)) {
      throw new Error('results is not an array');
    }
  
    if (results.length === 0) {
      return 'Veri bulunamadı.';
    }
  
    const prompt = `Bu metinleri öğrenciye ders anlatır gibi özetler misin?= :${results}\n`;
    return prompt;
  }
  

  trackByFn(index: number, item: any): number {
    return index;
  }

  goToBottom() {
    const element = document.getElementById("history");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }

  askQuestionBasedOnSummary(summary: string, index: number, groupedResults: string[][]) {
    const questionPrompt = `Bu özete dayalı bir soru oluştur ve sen cevaplama lütfen: ${summary}`;
    
    this.t3Service.sendPrompt(questionPrompt)
      .subscribe(response => {
        const question = { id: this.chatHistory.length + 1, from: 'assistant', message: `Soru: ${response}` };
        this.chatHistory.push(question);
        console.log('Soru yanıtı:', response);
  
        this.waitingForAnswer = true;
        this.loading = false;
      }, error => {
        this.errorMessage = 'Soru gönderme hatası: ' + error.message;
        console.error('Error:', error);
        this.loading = false;
      });
      this.prompt = '';
  }

  submitAnswer() {
    if (this.waitingForAnswer && this.userAnswer) {
      console.log("Verilen cevap:", this.userAnswer); 

      const lastQuestion = this.chatHistory.filter(item => item.from === 'assistant').pop();
  
      if (lastQuestion) {
        this.chatHistory.push({ from: 'user', message: this.userAnswer, questionId: lastQuestion.id });
        console.log(`Cevap verilen soru ID: ${lastQuestion.id}`);
  
        this.evaluateAnswer(this.userAnswer);
  
        this.waitingForAnswer = false;
        this.userAnswer = '';
      }
    }
  }

  evaluateAnswer(answer: string) {
    // Son iki asistan mesajını buluyoruz.
    const lastTwoAssistantMessages = this.chatHistory
      .filter(item => item.from === 'assistant') // Sadece asistanın mesajlarını alıyoruz.
      .slice(-2) // Son iki asistan mesajını alıyoruz.
      .map(item => item.message) // Mesajların içeriklerini alıyoruz.
      .join('\n'); // İki mesajı birleştiriyoruz.
  
    if (!lastTwoAssistantMessages) {
      console.error('Asistanın mesajları bulunamadı.');
      return;
    }
    console.log('Son iki asistan mesajı:', lastTwoAssistantMessages);
  
    // Değerlendirme için prompt oluşturuyoruz
    const prompt = `Paragraf ve soru: ${lastTwoAssistantMessages}\nKullanıcı cevabı: ${answer}\nBu paragraf ve soruya göre kullanıcının verdiği yanıt alakalı? Doğruysa tebrik et, yanlışsa düzelt.`;
  
    console.log(prompt);
    // Asistanın iki mesajı ve kullanıcının cevabı değerlendirme için gönderiliyor.
    this.t3Service.sendPrompt(prompt)
      .subscribe(response => {
        this.chatHistory.push({ from: 'assistant', message: `Değerlendirme: ${response}` });
        console.log('Değerlendirme yanıtı:', response);
      }, error => {
        console.error('Değerlendirme hatası:', error);
        this.errorMessage = 'Değerlendirme sırasında bir hata oluştu.';
      });
  }
}