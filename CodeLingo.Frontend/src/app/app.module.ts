import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PracticeStarterComponent } from './practice-starter/practice-starter.component';
import { LanguageSelectorComponent } from './practice-starter/language-selector/language-selector.component';
import { DifficultySelectorComponent } from './practice-starter/difficulty-selector/difficulty-selector.component';
import { QuestionCountSelectorComponent } from './practice-starter/question-count-selector/question-count-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/components/profile-info/profile-info.component';
import { AvatarUploadComponent } from './profile/components/avatar-upload/avatar-upload.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MultipleChoiceQuestionComponent } from './question-container/multiple-choice-question/multiple-choice-question.component';
import { QuestionContainerComponent } from './question-container/question-container.component';
import { QuestionProgressComponent } from './question-container/question-progress/question-progress.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LandingPageComponent,
    LeaderboardComponent,
    PracticeStarterComponent,
    LanguageSelectorComponent,
    DifficultySelectorComponent,
    QuestionCountSelectorComponent,
    ProfileComponent,
    ProfileInfoComponent,
    AvatarUploadComponent,
    LoginComponent,
    RegisterComponent,
    MultipleChoiceQuestionComponent,
    QuestionContainerComponent,
    QuestionProgressComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

