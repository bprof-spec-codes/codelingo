import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path: '', redirectTo: 'landing-page', pathMatch: 'full'},
  {path: 'landing-page', component: LandingPageComponent},
    { path: 'admin', component: AdminPanelComponent, /*canActivate:[adminGuard]*/},
  {path: '**', redirectTo: 'landing-page', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
