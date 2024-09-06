import { Component, ElementRef, ViewChild } from '@angular/core';
import { T3serviceService } from '../t3service.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-explanation',
  templateUrl: './explanation.component.html',
  styleUrls: ['./explanation.component.css']  // "styleUrl" değil, "styleUrls" olmalı.
})
export class ExplanationComponent {

  loading: boolean = false;
  prompt: string = '';  // Kullanıcının girdiği mesaj
  chatHistory: any[] = [];  // Mesaj geçmişi
  results: any[] = [];  // Sonuçlar
  promptResponse: any;
  errorMessage: string = '';
  @ViewChild('chatHistoryContainer', { static: false }) chatHistoryContainer!: ElementRef;

  title = 'Explanation Component';

  constructor(private t3Service: T3serviceService) {
    // Mesaj geçmişini dinleyip bileşen içinde güncelliyoruz
    this.t3Service.messageHistory.subscribe((history) => {
      
        this.chatHistory = history;
      
    });
  }

  ngOnInit(): void {}

  async sendData() {
    if (!this.prompt.trim()) {
      return; // Boş mesaj göndermeyi engelle
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
  
        // Veriyi gruplara bölme
        const groupedResults = this.groupResults(this.results, 3);
  
        // İlk grubu işleme
        this.processGroup(0, groupedResults);
        
      }, error => {
        this.errorMessage = 'Veri çekme hatası: ' + error.message;
        console.error('Error:', error);
        this.loading = false;  // Yükleme durumunu sonlandır
      });
  }
  
  groupResults(results: string[], groupSize: number): string[][] {
    const grouped: string[][] = [];
    for (let i = 0; i < results.length; i += groupSize) {
      grouped.push(results.slice(i, i + groupSize));
    }
    return grouped;
  }

  sendGroupedPrompts(groups: string[][]) {
    const promptObservables = groups.map(group => {
      const prompt = this.createPromptFromResults(group);
      const modifiedPrompt = this.modifyPrompt(prompt);
      return this.t3Service.sendPrompt(modifiedPrompt);
    });

    
  
    // Tüm API çağrılarını aynı anda yap
    forkJoin(promptObservables).subscribe(responses => {
      // Her bir yanıtı chatHistory'e ekleyelim
      responses.forEach((response, index) => {
        this.chatHistory.push({ from: 'assistant', message: response });
      });
      this.prompt = '';  // Mesajı temizle
      this.loading = false;  // Yükleme durumunu sonlandır
    }, error => {
      this.errorMessage = 'Prompt gönderme hatası: ' + error.message;
      console.error('Error:', error);
      this.loading = false;  // Yükleme durumunu sonlandır
    });
  }

  processGroup(index: number, groupedResults: string[][]) {
    if (index >= groupedResults.length) {
      this.loading = false;  // Tüm gruplar işlendikten sonra yüklemeyi durdur
      this.prompt = '';  // Mesajı temizle
      return;
    }
  
    const group = groupedResults[index];
    const prompt = this.createPromptFromResults(group);
    const modifiedPrompt = this.modifyPrompt(prompt);
  
    this.t3Service.sendPrompt(modifiedPrompt)
      .subscribe(response => {
        this.chatHistory.push({ from: 'assistant', message: response });
        console.log('Prompt yanıtı:', response);
  
        // Bir sonraki grup ile devam et
        this.processGroup(index + 1, groupedResults);
      }, error => {
        this.errorMessage = 'Prompt gönderme hatası: ' + error.message;
        console.error('Error:', error);
        this.loading = false;  // Hata durumunda yüklemeyi sonlandır
      });
  }
  
  createPromptFromResults(results: string[]): string {
    if (!Array.isArray(results)) {
      throw new Error('results is not an array');
    }
  
    // Boş dizi durumu kontrolü
    if (results.length === 0) {
      return 'Veri bulunamadı.';
    }
  
  
    // Prompt'a ekleme yapmak
    const prompt = `Bu metinleri öğrenciye ders anlatır gibi özetler misin?= :${results}\n`;
    return prompt;
  }
  
  modifyPrompt(prompt: string): string {
    return `Başlık: Eğitim Konusu\n\n${prompt}`;
  }
  
  trackByFn(index: number, item: any): number {
    return index;
  }

  goToBottom(){
    const element = document.getElementById("history");
    if(element){
      element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });  

    }
  }

}