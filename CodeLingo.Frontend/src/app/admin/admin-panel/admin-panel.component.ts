import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Question } from '../../models/question';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})

  //toDo: Question type input should be radio 

export class AdminPanelComponent implements OnInit {
  questions$!: Observable<Question[]>;
  
  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    //this.loadQuestions();

  }

}
