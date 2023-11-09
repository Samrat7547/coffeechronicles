import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{

  addItemForm!: FormGroup;

  constructor(private authService:AuthService, private fb: FormBuilder,private router: Router,
    private toastr:ToastrService){

  }

  ngOnInit(): void {
    this.addItemForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
    });

  }

  changePassword(data: any) {
    
    this.authService.changePassword(data).subscribe(
      (res: any) => {
        this.router.navigate(['/dashboard']);
        this.toastr.success('Success', 'Password Changed Successfully');
        console.log(res);
        
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        
        this.toastr.error('Error', 'Put Your old password correctly ');
      }
    );
  }
}
