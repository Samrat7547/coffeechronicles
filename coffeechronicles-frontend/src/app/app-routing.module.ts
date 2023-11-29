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
import { LoadProductComponent } from './pages/load-product/load-product.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { authGuard } from './services/auth.guard';
import { ReviewComponent } from './pages/review/review.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path:'signup', component: SignupComponent,pathMatch: 'full'},
  { path:'login',component: LoginComponent, pathMatch: 'full' },
  { path:'forgot',component: ForgotPasswordComponent, pathMatch: 'full' },
  { path:'dashboard',component: DashboardComponent, pathMatch: 'full', canActivate: [authGuard] },
  {path: 'category',component: CategoryComponent,pathMatch: 'full', canActivate: [authGuard] },
  { path:'menu',component: MenuComponent, pathMatch: 'full' , canActivate: [authGuard] },
  { path: 'menu/:cid', component: MenuComponent },
  { path:'order',component: OrderComponent, pathMatch:'full', canActivate: [authGuard] },
  { path: 'category/:cid', component: LoadProductComponent },
  { path:'changePassword', component:ChangePasswordComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'manage-user', component: ManageUserComponent},
  { path: 'view-user', component: ViewUserComponent},
  { path: 'review' , component:ReviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
