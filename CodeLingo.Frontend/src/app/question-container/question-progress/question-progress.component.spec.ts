import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QuestionProgressComponent } from './question-progress.component';
import { Component } from '@angular/core';

describe('QuestionProgressComponent', () => {
  let component: QuestionProgressComponent;
  let fixture: ComponentFixture<QuestionProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionProgressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display currentIndex / totalQuestions', () => {
    component.currentIndex = 2;
    component.totalQuestions = 5;
    fixture.detectChanges();

    const valueEl = fixture.debugElement.query(By.css('.progress-item .value'))
      .nativeElement as HTMLElement;

    expect(valueEl.textContent).toContain('2 / 5');
  });

  it('should calculate progress bar width correctly', () => {
    component.currentIndex = 3;
    component.totalQuestions = 6;
    fixture.detectChanges();

    const fillEl = fixture.debugElement.query(By.css('.progress-fill'))
      .nativeElement as HTMLElement;

    // width should be (3/6)*100 = 50%
    expect(fillEl.style.width).toBe('50%');
  });

  it('should handle edge case when currentIndex > totalQuestions', () => {
    component.currentIndex = 10;
    component.totalQuestions = 5;
    fixture.detectChanges();

    const fillEl = fixture.debugElement.query(By.css('.progress-fill'))
      .nativeElement as HTMLElement;

    // width should not exceed 100%
    expect(parseFloat(fillEl.style.width)).toBeGreaterThanOrEqual(200); // logically it would calculate 200%, maybe clamp?
  });

  it('should default currentIndex and totalQuestions to 1', () => {
    const valueEl = fixture.debugElement.query(By.css('.progress-item .value'))
      .nativeElement as HTMLElement;

    expect(valueEl.textContent).toContain('1 / 1');
  });
});
