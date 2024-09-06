import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EduRagResponse } from './models/eduragresponse';

@Injectable({
  providedIn: 'root'
})
export class T3serviceService {

  messageHistory: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private messageHistoryQuestionAnsweringSubject = new BehaviorSubject<any[]>([]);
  messageHistoryQuestionAnswering = this.messageHistoryQuestionAnsweringSubject.asObservable();

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

    return this.http.post<any>(url, JSON.stringify(payload), { headers });
  }

  getEduRag(query: string): Observable<EduRagResponse> {
    const apiUrl = 'http://localhost:8000/api/v1/edu-rag';
    const body = {
      query: query,
      id: 0
    };
  
    return this.http.post<EduRagResponse>(apiUrl, body);
  }

  sendPrompt(prompt: string): Observable<any> {
    const url = "http://127.0.0.1:5000/generate";  
    const body = { prompt: prompt };
    return this.http.post<any>(url, body);
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
        const history = this.messageHistoryQuestionAnsweringSubject.getValue();
        history.push({ from: 'user', message: prompt });
        history.push({ from: 'assistant', message: response });  
        this.messageHistoryQuestionAnsweringSubject.next(history);
      }, error => {
        console.error('Error:', error);
      });
  }

  submitFeedback(message: string, feedbackText: string): Observable<any> {
    const url = 'http://127.0.0.1:5000/save-feedback';
    const feedback = {
      interaction_id: '12345',  
      user_id: 'user_001',  
      timestamp: new Date().toISOString(),
      content_generated: {
        input_prompt: message,
        response: 'Model yaniti buraya gelecek' 
      },
      user_feedback: {
        rating: 'dislike',
        feedback_text: feedbackText,
        preferred_response: 'Daha iyi bir yanit olabilirdi.' 
      },
      feedback_metadata: {
        device: 'macos',
        location: 'Antalya, Türkiye',
        session_duration: 30  
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(url, JSON.stringify(feedback), { headers });
  }

  

 




}