import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
loginForm!:FormGroup;
hidepassword=true;
constructor(
  private formBuilder: FormBuilder,
  private router: Router
){}

ngOnInit(): void{
this.loginForm=this.formBuilder.group({
  email:[null,[Validators.required]],
  password:[null,[Validators.required]]
})
}
togglePasswordVisibility(){
  this.hidepassword=!this.hidepassword;
}
onSubmit(): void{
  console.log("Success")
}
goToHome(): void{
  console.log("lalala")
}


}
