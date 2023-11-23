import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewUserComponent } from '../pages/view-user/view-user.component';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-viewmenu',
  templateUrl: './viewmenu.component.html',
  styleUrls: ['./viewmenu.component.css']
})
export class ViewmenuComponent {

  user!: any;

  
  constructor(
    private _route: ActivatedRoute,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dialogRef: MatDialogRef<ViewmenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(
      'Received data:',
      data.name,
      data.title,
      data.description,
      data.price,
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
