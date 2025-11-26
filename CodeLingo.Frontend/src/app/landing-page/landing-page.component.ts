import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentState } from '../models/component-state';
import { GettingStartedStep } from '../models/getting-started-step';
import { Feature } from '../models/feautre';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;

  constructor(private router: Router, private auth: AuthService) {}

  // Component state
  state: ComponentState = {
    isLoading: false,
    error: null,
  };

  // Logged in user details TODO: Replace with actual user data
  username: string = 'JohnDoe';
  userRank: number = 42;

  features: Feature[] = [
    {
      title: 'Interactive Practice',
      description:
        'Solve real coding problems with instant feedback and explanations.',
      icon: 'bi-code-slash',
    },
    {
      title: 'Multiple Languages',
      description:
        'Practice with JavaScript, Python, Java, C#, and more programming languages.',
      icon: 'bi-laptop',
    },
    {
      title: 'Track Progress',
      description:
        'Monitor your improvement with detailed statistics and analytics.',
      icon: 'bi-bar-chart',
    },
    {
      title: 'Global Ranking',
      description: 'Compete with other developers and climb the leaderboard.',
      icon: 'bi-trophy',
    },
  ];

  gettingStartedSteps: GettingStartedStep[] = [
    {
      number: 1,
      title: 'Create your account',
      description: 'Sign in to personalize your sessions and save progress.',
    },
    {
      number: 2,
      title: 'Pick a language',
      description:
        'Choose from popular languages like TypeScript, Python, and Java.',
    },
    {
      number: 3,
      title: 'Start a practice session',
      description: 'Begin solving challenges and track your improvement.',
    },
  ];

  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  signUp(): void {
    console.log('Navigate to sign in');
    this.router.navigate(['/register']);
  }

  tryCodeLingo(): void {
    const element = document.getElementById('getting-started');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  login(): void {
    console.log('Navigate to login page');
    this.router.navigate(['/login']);
  }

  startPractice(): void {
    console.log('Navigate to practice session');
    //TODO: route to practice session
    this.router.navigate(['/practice/start']);
  }
}
