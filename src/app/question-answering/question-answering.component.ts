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

    const formattedPrompt = `Bu soruda tek bir doğru cevap var. Doğru şıkkı seçip, bana açıklar mısın?\n\nSoru: ${this.prompt}`;
    
    this.prompt = '';  

    await this.t3Service.generateQuestionAnswering(formattedPrompt);  
    this.loading = false;
  }

  goToBottom() {
    const element = document.getElementById("history");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });  
    }
  }

  likeAnswer(message: any) {
    console.log('Beğenilen cevap:', message.message);
  }

  dislikeAnswer(message: any) {
    this.showFeedbackForm = true;
    this.selectedMessage = message;
  }

  submitFeedback() {
    if (this.selectedMessage) {
      this.t3Service.submitFeedback(this.selectedMessage.message, this.feedback)
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
}