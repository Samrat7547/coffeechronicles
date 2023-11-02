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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
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
    private dialog:MatDialog
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
              this.router.navigate(['/home']);
              this.toastr.success(
                'Yay! You are logged in.',
                'Admin Login Succesful'
              );
            } else {
              //user-dashboard
              this.router.navigate(['/home']);
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
        this.errorMessage = 'Wrong user credentials';
        console.log(this.errorMessage);
        this.toastr.error('Please enter correct login credentials.');
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
  
}
