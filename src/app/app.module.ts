import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { ExplanationComponent } from './explanation/explanation.component';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import { MatRadioModule } from '@angular/material/radio';
import { QuestionAnsweringComponent } from './question-answering/question-answering.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DailyRemindersComponent } from './daily-reminders/daily-reminders.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    ExplanationComponent,
    QuestionAnsweringComponent,
    QuizComponent,
    SkeletonComponent,
    ScheduleComponent,
    DailyRemindersComponent,
    MyQuizzesComponent
    
  ],
  // ...

    imports: [
      BrowserModule,
      MatRadioModule,
      RouterModule,
      MatCardModule,
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      AppRoutingModule,
      MatToolbarModule,
      MatButtonModule,
      MatSidenavModule,
      MatSelectModule, 
      MatFormFieldModule,
      MatIconModule,
      MatListModule,
      CommonModule,
      MatSidenavModule,
      MatFormFieldModule,
      MatGridListModule,
      MatCardModule,
      MatMenuModule,
      FormsModule,
      MatDatepickerModule, // Add MatDatepickerModule here
      ReactiveFormsModule,
      MatSnackBarModule // Add MatSnackBarModule here
    ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
