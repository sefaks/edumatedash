import { Component } from '@angular/core';
import { T3serviceService } from '../t3service.service';

@Component({
  selector: 'app-question-answering',
  templateUrl: './question-answering.component.html',
  styleUrl: './question-answering.component.css'
})
export class QuestionAnsweringComponent {

  loading: boolean = false;
  prompt: string = '';  // Kullanıcının girdiği mesaj
  chatHistory: any[] = [];  // Mesaj geçmişi

  title = 'Question-Answering Component';

  constructor(private t3Service: T3serviceService) {

    this.t3Service.messageHistory.subscribe((history) => {
      
        this.chatHistory = history;
      
    });
  }

  ngOnInit(): void {}

  async sendData() {
    if (this.prompt.trim() === '') {
      return;  
    }

    this.loading = true;
    const userInput = this.prompt;  
    this.prompt = '';  
    await this.t3Service.generateQuestionAnswering(userInput);  
    this.loading = false;
  }
}
  


