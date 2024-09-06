import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { ExplanationComponent } from './explanation/explanation.component';
import { QuestionAnsweringComponent } from './question-answering/question-answering.component';
import { QuizComponent } from './quiz/quiz.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DailyRemindersComponent } from './daily-reminders/daily-reminders.component';

const routes: Routes = [
  { 
    path: 'navigation',
    component: NavigationComponent,
    children: [
      { path: 'quiz', component: QuizComponent },
      { path: 'question-answering', component: QuestionAnsweringComponent },
      { path: 'explanation', component: ExplanationComponent },
      { path: 'schedule', component: ScheduleComponent },
      {path: 'daily-reminders', component: DailyRemindersComponent},
      { path: '', redirectTo: 'explanation', pathMatch: 'full' },
      { path: '**', redirectTo: 'explanation' }
    ]
  },
  // Eğer root path'e (yani '/') gidilirse 'navigation/explanation' yoluna yönlendir
  { path: '', redirectTo: '/navigation/explanation', pathMatch: 'full' },
  { path: '**', redirectTo: '/navigation/explanation' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
