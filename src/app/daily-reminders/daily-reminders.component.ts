import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-daily-reminders',
  templateUrl: './daily-reminders.component.html',
  styleUrls: ['./daily-reminders.component.css']
})
export class DailyRemindersComponent {
  lessonForm!: FormGroup;
  lessons: any = {}; // Ders programını saklamak için yer
  selectedLesson: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.lessonForm = this.fb.group({
      date: [''],
      ders: ['']
    });

    this.loadLessons(); // Ders programını yükle
  }

  loadLessons() {
    const savedLessons = localStorage.getItem('schedule');
    if (savedLessons) {
      this.lessons = JSON.parse(savedLessons); // localStorage'dan ders programını al
    }
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.value);
    const previousDate = new Date(selectedDate);
    previousDate.setDate(selectedDate.getDate() - 1); // Bir gün önceki tarihi hesapla

    const previousDay = this.getDayName(previousDate);
    this.updateLessonInfo(previousDay); // Bir önceki güne göre ders bilgilerini güncelle
  }

  getDayName(date: Date): string {
    const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
    return dayNames[date.getDay() - 1]; // Türkiye'de hafta Pazartesi'den başlar
  }

  updateLessonInfo(day: string) {
    if (this.lessons[day]) {
      this.selectedLesson = {
        title: `${day} Dersi Tekrar Bilgileri`,
        content: this.lessons[day].join(', ') // Ders bilgilerini birleştirip göster
      };
    } else {
      this.selectedLesson = null; // Eğer o gün ders yoksa boş bırak
    }
  }
}