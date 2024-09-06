import { Component } from '@angular/core';
import { T3serviceService } from '../t3service.service';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']  // "styleUrl" değil, "styleUrls" olmalı.
})
export class ExplanationComponent {

  loading: boolean = false;
  prompt: string = '';  // Kullanıcının girdiği mesaj
  chatHistory: any[] = [];  // Mesaj geçmişi

  title = 'Explanation Component';

  constructor(private t3Service: T3serviceService) {
    // Mesaj geçmişini dinleyip bileşen içinde güncelliyoruz
    this.t3Service.messageHistory.subscribe((history) => {
      
        this.chatHistory = history;
      
    });
  }

  ngOnInit(): void {}

  async sendData() {
    if (this.prompt.trim() === '') {
      return;  // Boş mesaj gönderilmesin
    }

    this.loading = true;
    const userInput = this.prompt;  // Kullanıcının girdiği mesajı saklıyoruz
    this.prompt = '';  // Girdi alanını temizliyoruz
    await this.t3Service.generateText(userInput);  // Kullanıcı girdiğini gönderiyoruz
    this.loading = false;
  }
}