import { Component, OnInit } from '@angular/core';
import { T3serviceService } from '../t3service.service';

@Component({
  selector: 'app-question-answering',
  templateUrl: './question-answering.component.html',
  styleUrl: './question-answering.component.css'
})
export class QuestionAnsweringComponent implements OnInit {

  loading: boolean = false;
  prompt: string = '';  
  chatHistory: any[] = [];  
  showFeedbackForm: boolean = false;
  selectedMessage: any;
  feedback: string = '';
  isLike: boolean = false; // Kullanıcının beğenme durumu


  constructor(private t3Service: T3serviceService) { }

  ngOnInit(): void {
    this.t3Service.messageHistoryQuestionAnswering.subscribe((history) => {
      this.chatHistory = history;
    });
  }

  async sendData() {
    if (this.prompt.trim() === '') {
      return;  
    }
  
    this.loading = true;
  
    const formattedPrompt = `Bu soruda tek bir doğru cevap var. Doğru şıkkı seçip, bana açıklayarak anlatır mısın?\n\nSoru: ${this.prompt}`;
    
    const userQuestion = this.prompt;
    this.chatHistory.push({ from: 'user', message: userQuestion });
  
    this.prompt = '';
  
    try {
      await this.t3Service.generateQuestionAnswering(formattedPrompt);  
    } catch (error) {
      console.error('Model çağrısı sırasında hata:', error);
    }
  
    this.loading = false;
  }

  goToBottom() {
    const element = document.getElementById("history");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });  
    }
  }

  likeAnswer(item: any) {
    console.log('Beğen butonuna tıklandı. Item:', item);
    this.isLike = true;
    this.selectedMessage = item;
  }

  dislikeAnswer(item: any) {
    console.log('Beğenmedim butonuna tıklandı. Item:', item);
    this.isLike = false;
    this.selectedMessage = item;
    this.showFeedbackForm = true;
  }

  submitFeedback() {
    if (this.selectedMessage) {
      const rating = this.isLike ? 'like' : 'dislike'; // isLike, kullanıcının beğenme durumu
      const response = this.selectedMessage.response; // Model yanıtı
  
      this.t3Service.submitFeedback(this.selectedMessage.message, this.feedback, rating, response)
        .subscribe(response => {
          console.log('Geri bildirim:', response);
          this.showFeedbackForm = false;
          this.feedback = '';
        }, error => {
          console.error('Geri bildirim gönderme hatası:', error);
        });
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
  closeFeedbackForm() {
    this.showFeedbackForm = false;
  }

  
}