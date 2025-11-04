import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemComponent } from './admin-item.component';

describe('AdminItemComponent', () => {
  let component: AdminItemComponent;
  let fixture: ComponentFixture<AdminItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
