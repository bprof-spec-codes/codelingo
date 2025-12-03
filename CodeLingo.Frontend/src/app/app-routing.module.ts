import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PracticeStarterComponent } from './practice-starter/practice-starter.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuestionContainerComponent } from './question-container/question-container.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './guards/admin.guard';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'practice/start', component: PracticeStarterComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'session/:id/questions', component: QuestionContainerComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'landing-page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }