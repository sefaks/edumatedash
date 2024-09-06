import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class T3serviceService {

  messageHistory: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  generateText(prompt: string) {
    const url = "http://127.0.0.1:5000/generate";  

    const payload = {
      prompt: prompt
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post<any>(url, JSON.stringify(payload), { headers })
      .subscribe(response => {
        console.log('LLM Cevap:', response);
        const history = this.messageHistory.getValue();
        history.push({ from: 'user', message: prompt });
        history.push({ from: 'assistant', message: response });
        this.messageHistory.next(history);
      }, error => {
        console.error('Error:', error);
      });
  }


  generateQuestionAnswering(prompt: string) {

    const url = "http://127.0.0.1:5000/generate";  

    const payload = {
      prompt: prompt
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post<any>(url, JSON.stringify(payload), { headers })
      .subscribe(response => {
        console.log('LLM Cevap:', response);
        const history = this.messageHistory.getValue();
        history.push({ from: 'user', message: prompt });
        history.push({ from: 'bot', message: response });
        this.messageHistory.next(history);
      }, error => {
        console.error('Error:', error);
      });
  }

  generateQuiz(formValues: any): Observable<any> {

    const url = "http://127.0.0.1:5000/generate";  

    // Prompt oluşturulması
    const input = `${formValues.ders} dersinden ${formValues.soruSayisi} adet ${formValues.zorluk} zorlukta ${formValues.soruStili} soru oluştur.`;

    const payload = {
      prompt: input
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // POST isteği ve yanıtın Observable olarak döndürülmesi
    return this.http.post<any>(url, JSON.stringify(payload), { headers });
  }

}