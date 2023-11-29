import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewUserComponent } from '../pages/view-user/view-user.component';
import { AuthService } from '../services/auth/auth.service';
import { ReviewService } from '../services/review/review.service';

@Component({
  selector: 'app-viewmenu',
  templateUrl: './viewmenu.component.html',
  styleUrls: ['./viewmenu.component.css']
})
export class ViewmenuComponent {

  user!: any;
  displayedColumns:string[]=['name','rating','review'];
  reviews: any;
  
  
  constructor(
    private _route: ActivatedRoute,
    private auth: AuthService,
    private reviewService:ReviewService,
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
      data.pid
    );
  }
  ngOnInit(): void {
    // console.log(this.data);
    this.reviewService.getReviewOfProducts(this.data.pid).subscribe(
      (data: any) => {
        
         this.reviews=data;
         console.log(this.reviews);
         
      },
      (error) => {
        console.log(error);
        this.toastr.error('Error', 'Server error');
      }
    );
  }
  closeDialog() {
    // Close the dialog when the close button is clicked
    // You can implement additional logic here if needed
    this.dialogRef.close();
  }
  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }
}
