import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  user!: any;

  // constructor(private _route:ActivatedRoute, private _quiz:QuizService, private toastr:ToastrService){}
  constructor(
    private _route: ActivatedRoute,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(
      'Received qid in InstructionsComponent:',
      data.id,
      data.userName,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.status
    );
  }
  ngOnInit(): void {
    // this._quiz.getQuiz(this.qid).subscribe(
    // this.auth.(this.qid).subscribe(
    //     (data:any)=>{
    //       console.log(data);
    //       this.quiz=data;
    //     },
    //     (error)=>{
    //       console.log(error);
    //       this.toastr.error('Error!!','Error in Loading');
    //     }
    //   )
  }
  closeDialog() {
    // Close the dialog when the close button is clicked
    // You can implement additional logic here if needed
    this.dialogRef.close();
  }
}