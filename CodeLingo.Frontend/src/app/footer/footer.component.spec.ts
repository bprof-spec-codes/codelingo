import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the logo image', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.attributes['alt']).toContain('Logo');
  });

  it('should contain 3 navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('a[routerLink]'));
    expect(links.length).toBe(3);
  });

  it('should contain a GitHub link', () => {
    const githubLink = fixture.debugElement.query(By.css('a[href*="github.com"]'));
    expect(githubLink).toBeTruthy();
  });

  it('should display the copyright text', () => {
    const text = fixture.debugElement.nativeElement.textContent;
    expect(text).toContain('© 2025 Codelingo Team');
  });
});