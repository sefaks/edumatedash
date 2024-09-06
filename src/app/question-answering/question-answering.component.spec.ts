import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnsweringComponent } from './question-answering.component';

describe('QuestionAnsweringComponent', () => {
  let component: QuestionAnsweringComponent;
  let fixture: ComponentFixture<QuestionAnsweringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionAnsweringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionAnsweringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
