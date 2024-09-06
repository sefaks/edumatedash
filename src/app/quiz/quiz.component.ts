import { Component, OnInit } from '@angular/core';
import { Question } from '../models/question';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { T3serviceService } from '../t3service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {

  quizForm!: FormGroup;

  numbers:number[]=[];
  pageTitle: string = "Mini Sınav Uygulaması";
  questions:Question[]= [];
  i:number = 0;


  constructor(private fb: FormBuilder,private t3Service:T3serviceService) { }

  ngOnInit(): void {

    this.setNumbers();

    this.quizForm = this.fb.group({
      ders: ['', Validators.required],
      soruStili: ['', Validators.required],
      zorluk: ['', Validators.required],
      soruSayisi: ['', Validators.required]
    });


  }

 
      // ...

      onQuizGenerate() {

        console.log('Form:', this.quizForm.value);
        if (this.quizForm.valid) {
          const formValues = this.quizForm.value;
          const input = `${formValues.ders} dersinden ${formValues.soruSayisi} adet ${formValues.zorluk} zorlukta ${formValues.soruStili} soru oluştur.`;
    
          // Servis çağrısı
          this.t3Service.generateQuiz(formValues).subscribe(
            (response: any) => {
              console.log('API Cevabı:', response);
              this.handleResponse(response);
              this.questions = this.parseQuizQuestions(response);

            },
            (error: any) => {
              console.error('API Hatası:', error);
            }
          );
        } else {
          console.log("Form geçersiz.");
        }
      }
    
      // API'den gelen cevabı işleyen metot
      handleResponse(response: any) {
        // Cevaba göre işlem yapabilirsiniz
        console.log('Oluşan Quiz:', response);
  
      }

      parseQuizQuestions(response: string): Question[] {
        // Yanıtın doğru formatta olup olmadığını kontrol edin
        console.log('Raw Response for Parsing:', response);
      
        // Yanıtı satırlara bölme
        const lines = response.split('\n').filter(line => line.trim() !== '');
      
        // Soruları oluşturma
        const questions: Question[] = lines.map((text: string) => ({
          text: text.replace(/\"/g, '').trim(),  // JSON içindeki çift tırnakları temizleyin ve boşlukları kaldırın
          type: 'open-ended'  // Örnek olarak tüm soruların türünü 'open-ended' yapıyoruz
        }));
      
        console.log('Parsed Questions:', questions);
        console.log(questions.length);
        return questions;
      }



  setNumbers(): void {
    for (let i = 0; i <= 20; i++) {
      this.numbers.push(i);
    }
  }

}
