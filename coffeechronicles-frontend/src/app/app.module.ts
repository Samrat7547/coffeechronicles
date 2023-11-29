import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import {  NgxUiLoaderModule,  NgxUiLoaderConfig,  SPINNER,  PB_DIRECTION,} from 'ngx-ui-loader';
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './pages/menu/menu.component';
import { CategoryComponent } from './pages/category/category.component';
import { OrderComponent } from './pages/order/order.component';
import { LoadProductComponent } from './pages/load-product/load-product.component';
import { RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { ViewUserComponent } from './pages/view-user/view-user.component';
import { ViewbillproductsComponent } from './viewbillproducts/viewbillproducts.component';
import { ViewmenuComponent } from './viewmenu/viewmenu.component';
import { RatereviewComponent } from './ratereview/ratereview.component';
import { ReviewComponent } from './pages/review/review.component';



const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading..',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  pbColor: '#0069d9',
  bgsColor: '#0069d9',
  fgsColor: '#0069d9',
  fgsType: SPINNER.threeStrings,
  fgsSize: 100,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
};
const config: SocialAuthServiceConfig = {
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,

      provider: new GoogleLoginProvider(
        '70674515851-as87gs0v1dsuf9fsslu8on3lnd1d960j.apps.googleusercontent.com'
      ),
    },
    // Add other providers as needed
  ],
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    MenuComponent,
    CategoryComponent,
    OrderComponent,
    LoadProductComponent,
    ChangePasswordComponent,
    ProfileComponent,
    ManageUserComponent,
    ViewUserComponent,
    ViewbillproductsComponent,
    ViewmenuComponent,
    RatereviewComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    NgbModule,
    RouterModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    CardModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['example.com'],
        disallowedRoutes: ['example.com/examplebadroute/'],
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: config,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
