import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleForm!: FormGroup;
  days: string[] = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  lessonsPerDay: number[] = [1, 2, 3, 4, 5];
  message: string = ''; // Mesaj için değişken
  messageType: string = ''; // Mesaj türü için değişken (success, error)

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.scheduleForm = this.fb.group({});
    this.createScheduleForm();
    this.loadSchedule(); // Sayfa yüklendiğinde formu localStorage'dan yükle
  }

  createScheduleForm() {
    const startHour = 9;
    this.days.forEach((day) => {
      this.lessonsPerDay.forEach((lesson, index) => {
        const lessonTime = this.calculateTime(startHour, index);
        this.scheduleForm.addControl(
          `${day}_time_${lesson}`,
          this.fb.control(lessonTime, Validators.required)
        );
        this.scheduleForm.addControl(
          `${day}_course_${lesson}`,
          this.fb.control('', Validators.required)
        );
      });
    });
  }

  calculateTime(startHour: number, index: number): string {
    const hour = startHour + index;
    const formattedHour = hour < 10 ? '0' + hour : hour.toString();
    return `${formattedHour}:00`;
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      try {
        localStorage.setItem('schedule', JSON.stringify(this.scheduleForm.value));
        this.showMessage('Ders programı başarıyla kaydedildi!', 'success');
      } catch (error) {
        this.showMessage('Bir hata oluştu. Ders programı kaydedilemedi.', 'error');
      }
    } else {
      this.showMessage('Form geçersiz! Lütfen tüm alanları doldurun.', 'error');
    }
  }
  
  showMessage(message: string, type: string) {
    this.message = message;
    this.messageType = type;
  }

  loadSchedule() {
    const savedSchedule = localStorage.getItem('schedule');
    if (savedSchedule) {
      this.scheduleForm.patchValue(JSON.parse(savedSchedule));
    }
  }
}