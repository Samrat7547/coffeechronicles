import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoryComponent } from './pages/category/category.component';
import { MenuComponent } from './pages/menu/menu.component';
import { OrderComponent } from './pages/order/order.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path:'signup', component: SignupComponent,pathMatch: 'full'},
  { path:'login',component: LoginComponent, pathMatch: 'full' },
  { path:'forgot',component: ForgotPasswordComponent, pathMatch: 'full' },
  { path:'dashboard',component: DashboardComponent, pathMatch: 'full' },
  { path:'category',component: CategoryComponent, pathMatch: 'full' },
  { path:'menu',component: MenuComponent, pathMatch: 'full' },
  { path:'order',component: OrderComponent, pathMatch:'full'}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
