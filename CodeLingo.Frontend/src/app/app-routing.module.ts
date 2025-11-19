import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PracticeStarterComponent } from './practice-starter/practice-starter.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'practice/start', component: PracticeStarterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'landing-page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
