import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword: boolean = true;
  errorMessage!: String;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [
        null,
        [Validators.required, Validators.email, this.emailValidator],
      ],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      password: [null, [Validators.required]],
      // password: [null, [Validators.required, this.passwordValidator]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe(
        (response) => {
          console.log('Registration successful!');
          console.log(response);
          // this.router.navigate(['/login']);
          this.toastr.success('Please log In', 'Registration successful', {
            positionClass: 'toast-bottom-right',
          });
        },
        (error) => {
          this.errorMessage = 'Username or Email already exists!';
          console.log('Registration failed!');
          // console.log(error);
          console.log(error.error.text);
          if (error.error.text === 'Successfully Registered') {
            this.router.navigate(['/login']);
            this.toastr.success('Please log In', 'Registration successful', {
              positionClass: 'toast-bottom-right',
            });
          } else {
            this.toastr.error('WARNING: Username or Email already exists!');
          }
        }
      );
    } else {
      this.toastr.warning(
        'Please fill all the fields accordingly',
        'Invalid form'
      );
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // Custom email validation function
  emailValidator(control: FormControl) {
    const email = control.value;
    if (email && !email.endsWith('.com')) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Custom password validation function
  passwordValidator(control: FormControl) {
    const password = control.value;
    if (password && (password.length < 6 || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password))) {
      return { invalidPassword: true };
    }
    return null;
  }
}
