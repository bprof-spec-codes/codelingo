import { Component, OnInit } from '@angular/core';
import { QuestionService, QuestionDto } from '../services/question.service'


@Component({
  selector: 'app-demo',
  standalone: false,
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit{
  question?: QuestionDto;

  constructor(private qs: QuestionService) { }

  ngOnInit(): void {
    this.qs.getDemo().subscribe(q => this.question = q);
  }
}
