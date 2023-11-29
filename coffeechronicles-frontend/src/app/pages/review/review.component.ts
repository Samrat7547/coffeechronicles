import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from 'src/app/services/review/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  // dataSource: any;
  dataSource!: MatTableDataSource<any>;
  displayedColumns:string[]=['name','product','rating','review','view'];

  constructor(private reviewService:ReviewService, private toastr:ToastrService){

  }
  ngOnInit(): void {
    this.tableData();
  }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();

     // If you want to filter based on product name as well
  if (this.dataSource.filterPredicate) {
    this.dataSource.filterPredicate = (data, filter) => {
      const nameMatch = data.name.toLowerCase().includes(filter);
      const productMatch = data.product.name.toLowerCase().includes(filter);
      return nameMatch || productMatch;
    };
  }
  }
  tableData(){
    
    this.reviewService.getReviews().subscribe(
      (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        console.log(res);
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteReview(rid: any) {
    Swal.fire({
      icon:"warning",
      title:"Do you want to delete?",
      confirmButtonText:"Delete",
      showCancelButton:true,
    }).then((result)=>{
      if(result.isConfirmed){
        //delete
        this.reviewService.deleteReview(rid).subscribe(
          (data:any)=>{
            // this.quizzes=this.quizzes.filter((quiz:any)=>quiz.qid!=qId)
            this.tableData();
            this.toastr.success('Success!','Review deleted successfully');
          },
          (error)=>{
            console.log(error);
            this.toastr.error('Error','Error in deleting bill');
          }
        );
      }
    })
  }

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }
}
