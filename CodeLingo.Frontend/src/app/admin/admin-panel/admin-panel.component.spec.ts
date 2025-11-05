import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminService } from '../../services/admin.service';
import { Question } from '../../models/question';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CountUpModule } from 'ngx-countup';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let mockAdminService: jasmine.SpyObj<AdminService>;


  })
