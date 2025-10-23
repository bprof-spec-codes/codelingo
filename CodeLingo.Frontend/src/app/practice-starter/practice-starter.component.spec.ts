import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeStarterComponent } from './practice-starter.component';

describe('PracticeStarterComponent', () => {
  let component: PracticeStarterComponent;
  let fixture: ComponentFixture<PracticeStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticeStarterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
