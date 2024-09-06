import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRemindersComponent } from './daily-reminders.component';

describe('DailyRemindersComponent', () => {
  let component: DailyRemindersComponent;
  let fixture: ComponentFixture<DailyRemindersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailyRemindersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
