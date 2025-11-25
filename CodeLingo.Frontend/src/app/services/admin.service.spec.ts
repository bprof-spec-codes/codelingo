import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { Language } from '../models/language';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLanguages should emit mock languages from BehaviorSubject (no HTTP)', (done) => {
    service.getLanguages().subscribe((langs: Language[]) => {
      expect(langs.length).toBe(4);
      expect(langs[0].name).toBe('TypeScript');
      done();
    });

    // biztos, hogy nem ment ki HTTP-re
    httpMock.expectNone((req) => req.url.includes('/languages'));
  });

  it('addLanguage should POST to /admin/languages', () => {
    const payload = { name: 'Go', version: '1.23' };

    service.addLanguage(payload).subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/admin/languages'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
      id: 'lang-5',
      ...payload
    });
  });

  it('exportQuestions should GET blob with query params', () => {
    const params = {
      format: 'csv' as const,
      language: 'TypeScript',
      difficulty: 'easy'
    };

    service.exportQuestions(params).subscribe((blob) => {
      expect(blob).toBeInstanceOf(Blob);
    });

    const req = httpMock.expectOne((r) =>
      r.url.includes('/admin/questions/export')
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    expect(req.request.params.get('format')).toBe('csv');
    expect(req.request.params.get('language')).toBe('TypeScript');
    expect(req.request.params.get('difficulty')).toBe('easy');

    const mockBlob = new Blob(['id;question'], { type: 'text/csv' });
    req.flush(mockBlob);
  });
});