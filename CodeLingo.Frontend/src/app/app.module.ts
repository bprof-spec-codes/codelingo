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
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AdminItemComponent } from './admin/admin-item/admin-item.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CountUpModule } from 'ngx-countup';
import { AdminLanguageCreateComponent } from './admin/admin-language-create/admin-language-create.component';
import { AdminLanguageListComponent } from './admin/admin-language-list/admin-language-list.component';
import { AdminImportExportComponent } from './admin/admin-import-export/admin-import-export.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PracticeStarterComponent } from './practice-starter/practice-starter.component';
import { LanguageSelectorComponent } from './practice-starter/language-selector/language-selector.component';
import { DifficultySelectorComponent } from './practice-starter/difficulty-selector/difficulty-selector.component';
import { QuestionCountSelectorComponent } from './practice-starter/question-count-selector/question-count-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { McQuestionEditorComponent } from './question-editor/mc-question-editor/mc-question-editor.component';
import { CodeQuestionEditorComponent } from './question-editor/code-question-editor/code-question-editor.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/components/profile-info/profile-info.component';
import { AvatarUploadComponent } from './profile/components/avatar-upload/avatar-upload.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MultipleChoiceQuestionComponent } from './question-container/multiple-choice-question/multiple-choice-question.component';
import { CodeCompletionQuestionComponent } from './question-container/code-completion-question/code-completion-question.component';
import { QuestionContainerComponent } from './question-container/question-container.component';
import { QuestionProgressComponent } from './question-container/question-progress/question-progress.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { ResultSummaryComponent } from './question-container/result-summary/result-summary.component';
import { TooltipDirective } from './shared/directives/tooltip.directive';
import { provideToastr } from 'ngx-toastr';
import { ProgressDashboardComponent } from './profile/components/progress-dashboard/progress-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    LandingPageComponent,
    AdminPanelComponent,
    AdminListComponent,
    AdminEditComponent,
    AdminItemComponent,
    AdminLanguageCreateComponent,
    AdminLanguageListComponent,
    AdminImportExportComponent,
    LeaderboardComponent,
    PracticeStarterComponent,
    LanguageSelectorComponent,
    DifficultySelectorComponent,
    QuestionCountSelectorComponent,
    McQuestionEditorComponent,
    CodeQuestionEditorComponent,
    ProfileComponent,
    ProfileInfoComponent,
    AvatarUploadComponent,
    LoginComponent,
    RegisterComponent,
    MultipleChoiceQuestionComponent,
    CodeCompletionQuestionComponent,
    QuestionContainerComponent,
    QuestionProgressComponent,
    ResultSummaryComponent,
    TooltipDirective,
    ProgressDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CountUpModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    provideToastr()

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
