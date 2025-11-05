import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../../models/question';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.scss'
})
export class AdminListComponent {
  @Input() questions$!: Observable<Question[]>;
  constructor(){}
  onCreateQuestion() {
  // Példa: routing új kérdés formra
  // vagy modál megnyitása:
  // this.modalService.open(CreateQuestionModalComponent);
}
}
