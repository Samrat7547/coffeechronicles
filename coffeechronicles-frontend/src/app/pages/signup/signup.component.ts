import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!:FormGroup;
  hidePassword: boolean =  true;

constructor(private fb:FormBuilder,
  // private: AuthService,
  private router: Router){}

  ngOnInit():void{
    this.signupForm=this.fb.group({
 firstName: [null,[Validators.required]],
 lastName: [null,[Validators.required]],
 userName: [null,[Validators.required]],
  email: [null,[Validators.required,Validators.email]],
  phone: [null,[Validators.required,Validators.minLength(10),Validators.pattern('^[0-9]+$')]],
  password: [null,[Validators.required]],
    })
  }
  
  onSubmit():void{
    console.log("Success")
  }
  goToHome():void{
    console.log('lalala')
  }
  togglePasswordVisibility(){
    this.hidePassword=!this.hidePassword;
  }

}
