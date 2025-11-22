import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { provideHttpClient } from '@angular/common/http';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminListComponent } from './admin/admin-list/admin-list.component';
import { AdminEditComponent } from './admin/admin-edit/admin-edit.component';
import { AdminItemComponent } from './admin/admin-item/admin-item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CountUpModule } from 'ngx-countup';
import { AdminLanguageCreateComponent } from './admin/admin-language-create/admin-language-create.component';
import { AdminLanguageListComponent } from './admin/admin-language-list/admin-language-list.component';
import { AdminImportExportComponent } from './admin/admin-import-export/admin-import-export.component';

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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CountUpModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
