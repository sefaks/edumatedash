import { Question } from "./question";

export class Exam {
    questions: Question[]; // Sınav soruları
    totalDuration: number; // Toplam süre (saniye cinsinden)
    remainingTime: number; // Kalan süre (saniye cinsinden)
    userAnswers: any; // Kullanıcının cevapları

    constructor(questions: any[], totalDuration: number) {
        this.questions = questions;
        this.totalDuration = totalDuration;
        this.remainingTime = totalDuration;
        this.userAnswers = {};
    }

 
   
}