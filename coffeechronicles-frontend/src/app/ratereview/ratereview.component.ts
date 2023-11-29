import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewbillproductsComponent } from '../viewbillproducts/viewbillproducts.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../services/sharedData/shared-data.service';
import { ReviewService } from '../services/review/review.service';
import { OrderService } from '../services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ratereview',
  templateUrl: './ratereview.component.html',
  styleUrls: ['./ratereview.component.css']
})
export class RatereviewComponent {
  dataSource: any;
  data: any;
  // reviewForm!: FormGroup;
  reviewForms: FormGroup[] = [];
  reviews: any[] = [];
  userDetails: any;
  selectedStars: number[] = [];
  reviewSubmitted: boolean[] = []; 

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewbillproductsComponent>,private fb: FormBuilder,private toastr:ToastrService,
    public sharedDataService: SharedDataService, private reviewService:ReviewService, private billService:OrderService,private router: Router,) { }

  ngOnInit() {
    console.log(this.dialogData.data.productDetail);
    this.data = this.dialogData.data;
    this.dataSource = this.dialogData.data.productDetail;
    // this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    console.log(this.dialogData.data);
    console.log(this.dataSource);

     // Create a form for each item in the loop
     this.dataSource.forEach(() => {
      this.reviewForms.push(this.createReviewForm());
    });

    // this.reviewForm = this.fb.group({
    //   rating: [null, Validators.required],
    //   review: ['', Validators.required],
    // });

    this.sharedDataService.userDetailsObservable.subscribe((userDetails) => {
      this.userDetails = userDetails;
    });
  }
  createReviewForm(): FormGroup {
    return this.fb.group({
      rating: [null, [Validators.required, this.ratingValidator]],
      review: ['', Validators.required],
    });
  }

  submitReview(form: FormGroup, q: any,index: number): void {
    if (form.valid) {
      const reviewData = {
        rating: form.value.rating,
        review: form.value.review,
        pid: q.pid,
      };

      this.reviews.push(reviewData);

      // Handle the submission logic (e.g., send data to backend)
      console.log(`Review submitted for PID ${q.pid}:`, reviewData);

      // Show a success message
      this.toastr.success('Success!', 'Review added successfully');
      this.reviewSubmitted[index] = true;
      // Reset the form after submission
      form.reset();
    } else {
      // Show an error message or handle invalid form state
      this.toastr.error('Error!', 'Internal Error');
    }
  }

   // Function to handle final submission
   submitAllReviews(): void {
    // Iterate through the reviews array and call the service for each item
    this.reviews.forEach((review) => {
      // You may need to adapt the structure of reviewData based on your requirements
      const reviewData = {
        rating: review.rating,
        review: review.review,
        name: `${this.userDetails.firstName} ${this.userDetails.lastName}`,
        email: this.userDetails.email,
        product: {
          pid: review.pid,
        },
      };
      // Call your service method
      this.reviewService.addReview(reviewData).subscribe(
        (response) => {
          console.log(`Review submitted successfully for PID: ${review.pid}`);
          // You can add additional logic or show a success message here
        },
        (error) => {
          console.error(`Failed to submit review for PID: ${review.pid}`, error);
          // You can add additional error handling or show an error message here
        }
      );
    });

    this.billService.update(this.data.id, !this.data.active).subscribe(
      (result: any) => {
        this.toastr.success('Success!', 'User updated');
        console.log(result);
        
      },
      (error: any) => {
        
        this.toastr.error('Error', 'Error in updating user');
        console.log(error);
        
      }
    );
    this.dialogRef.close();
    // Show a success message after all reviews are submitted
    this.toastr.success('Success!', 'All Reviews submitted');
    // Reset the form and reviews array after final submission
    // this.reviewForms.reset();
    this.reviews = [];
    // this.router.navigate(['/dashboard']);

  }
  ratingValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const rating = control.value;
    if (rating === null || rating < 1 || rating > 5) {
      return { 'invalidRating': true };
    }
    return null;
  }


  getStars(rating: number): number[] {
    const totalStars = 5;
    const stars = Array(totalStars).fill(0).map((_, index) => index + 1);
    return this.selectedStars.length > 0 ? this.selectedStars : stars;
  }
  
  
  setRating(star: number, control: AbstractControl): void {
    const currentRating = control.value;
    if (currentRating === star) {
      // If the clicked star is the current rating, deselect all stars
      this.selectedStars = [];
      control.setValue(null);
    } else {
      // Otherwise, select stars up to the clicked star
      this.selectedStars = Array(star).fill(0).map((_, index) => index + 1);
      control.setValue(star);
    }
  }

  hasGivenReview(index: number): boolean {
    // Check if the reviewForms array has a FormGroup at the specified index
    return this.reviewForms[index] !== undefined;
  }
  
  
}

