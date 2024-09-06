import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerEvaluationService {

  constructor(private http: HttpClient) {}
  evaluationApiUrl = 'http://127.0.0.1:8000/api/v1/generate'

  evaluateAnswer(data: { answer: string, question: any }): Observable<any> {
    // Cevap ve soruyu API'ye gönderip değerlendirme al
    return this.http.post<any>(this.evaluationApiUrl, data);
  }
}
