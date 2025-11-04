import { Component, Input } from '@angular/core';
import { Question } from '../../models/question';

@Component({
  selector: 'app-admin-item',
  standalone: false,
  templateUrl: './admin-item.component.html',
  styleUrl: './admin-item.component.scss'
})
export class AdminItemComponent {
@Input() question!: Question;
 showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
constructor(){}
}
