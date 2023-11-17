import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedDataService } from 'src/app/services/sharedData/shared-data.service';
import { ForgotPasswordComponent } from '../../forgot-password/forgot-password.component';
import { SignupComponent } from '../signup/signup.component';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user!: SocialUser;
  loggedIn!: boolean;
  loginForm!: FormGroup;
  hidepassword = true;
  errorMessage: string = '';
  userDetails: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private toastr: ToastrService,
    private dialog:MatDialog,
    private googleService: SocialAuthService,
    // @Inject(DOCUMENT) private document: Document
  ) {}



  ngOnInit(): void {
    localStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.email, this.emailValidator],
      ],
      password: [null, [Validators.required]],
    });


    this.googleService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      // console.log(user);
      // console.log('token: ' + user.idToken);
      const googleIdToken = user.idToken;
     //   /// send id token to the backend
     this.authService.sendTokenToBackend(googleIdToken).subscribe({
      next: (res) => {
        // console.log(res);
        
        localStorage.setItem('token', res.token);
        this.authService.getUserDetails().subscribe(
          (user: any) => {
            // console.log(res.token);
            // console.log(user);

            this.sharedDataService.setUserDetails(user);
            this.userDetails = user;
            if (this.authService.getRole()) {
              //admin dashboard
              this.router.navigate(['/dashboard']);
              this.toastr.success(
                'Yay! You are logged in.',
                'Admin Login Succesful'
              );
            } else {
              //user-dashboard
              this.router.navigate(['/menu']);
              this.toastr.success(
                'Yay! You are logged in.',
                'User Login Succesful'
              );
            }
          },
          (error) => {
            this.toastr.error('Something went wrong!');
          }
        );

      },
      error: (err) => {
        // console.log(err);
      },
    });
  });


  }







  togglePasswordVisibility() {
    this.hidepassword = !this.hidepassword;
  }
  onSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    console.log({ email, password });
    this.authService.login(email, password).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        // this.sharedDataService.setUserRole(localStorage.getItem('role'));
        this.authService.getUserDetails().subscribe(
          (user: any) => {
            console.log(response.token);
            console.log(user);

            this.sharedDataService.setUserDetails(user);
            this.userDetails = user;
            if (this.authService.getRole()) {
              //admin dashboard
              this.router.navigate(['/dashboard']);
              this.toastr.success(
                'Yay! You are logged in.',
                'Admin Login Succesful'
              );
            } else {
              //user-dashboard
              this.router.navigate(['/menu']);
              this.toastr.success(
                'Yay! You are logged in.',
                'User Login Succesful'
              );
            }
          },
          (error) => {
            this.toastr.error('Something went wrong!');
          }
        );

        // this.toastr.success('Yay! You are logged in.', 'Login Succesful');
        // this.router.navigate(['/home']);
      },
      (error) => {
        this.errorMessage = error.error.message;
        console.log(error);
        
        console.log(this.errorMessage);
        this.toastr.error(this.errorMessage);
      }
    );
  }
  goToHome() {
    this.router.navigate(['/home']);
  }

  // Custom email validation function
  emailValidator(control: FormControl) {
    const email = control.value;
    if (email && !email.endsWith('.com')) {
      return { invalidEmail: true };
    }
    return null;
  }

  signInWithGoogle(): void { 
   
    this.googleService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  
}
