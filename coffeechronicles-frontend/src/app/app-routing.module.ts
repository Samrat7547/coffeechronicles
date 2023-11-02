import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path:'signup', component: SignupComponent,pathMatch: 'full'},
  { path:'login',component: LoginComponent, pathMatch: 'full' },
  { path:'forgot',component: ForgotPasswordComponent, pathMatch: 'full' },
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
