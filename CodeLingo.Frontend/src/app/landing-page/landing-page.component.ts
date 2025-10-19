import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  
  // Logged in user details TODO: Replace with actual user data
  username: string = 'JohnDoe';
  userRank: number = 42;

  features = [
    {
      title: 'Interactive Practice',
      description: 'Solve real coding problems with instant feedback and explanations.',
      icon: 'bi-code-slash'
    },
    {
      title: 'Multiple Languages',
      description: 'Practice with JavaScript, Python, Java, C#, and more programming languages.',
      icon: 'bi-laptop'
    },
    {
      title: 'Progressive Learning',
      description: 'Start with basics and advance to complex concepts at your own pace.',
      icon: 'bi-graph-up'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed statistics and achievements.',
      icon: 'bi-trophy'
    }
  ];

  gettingStartedSteps = [
    {
      number: 1,
      title: 'Create your account',
      description: 'Sign in to personalize your sessions and save progress.'
    },
    {
      number: 2,
      title: 'Pick a language',
      description: 'Choose from popular languages like TypeScript, Python, and Java.'
    },
    {
      number: 3,
      title: 'Start a practice session',
      description: 'Begin solving challenges and track your improvement.'
    }
  ];


  ngOnInit(): void {
    // TODO: Check user authentication status
    this.isLoggedIn = false; // Replace with an actual authentication check method
  }

}
