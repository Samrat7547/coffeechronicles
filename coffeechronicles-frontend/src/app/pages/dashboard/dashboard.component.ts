import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { OrderService } from 'src/app/services/order/order.service';
import { saveAs } from 'file-saver';

import { ViewbillproductsComponent } from 'src/app/viewbillproducts/viewbillproducts.component';
import Swal from 'sweetalert2';
import { RatereviewComponent } from 'src/app/ratereview/ratereview.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allOrders$!: Observable<any>;
  ordersLength: number = 0;
  menuItems!: any;
  displayedColumns:string[]=['name','email','contactNumber', 'paymentMethod','totalAmount','view'];
  dataSource:any;
  responseMessage:any;
  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private authService: AuthService,
    private dialog:MatDialog,
    private toastr:ToastrService,
    private router: Router,
  
  ) {}
  ngOnInit(): void {
    this.getAllMenuItems();
  

    this.tableData();
    
  }
  getAllMenuItems() {
    this.menuService.getProducts().subscribe(
      (res: any) => {
        this.menuItems = res;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  tableData(){
    // this.orderService.getAllBills().subscribe(
    //   (response:any)=>{
    //   console.log(response); 
    //   this.dataSource= new MatTableDataSource (response);
    //   },
    //   (error:any)=>{
    //     console.log(error);
        
    //   }
    //   );
    this.allOrders$ = this.orderService.getAllBills().pipe(
      map((res: any) => {
        this.ordersLength = res?.length; 
        console.log(res);  
        return res.map((order: any) => {
          order.productDetail = JSON.parse(order.productDetail);
          // console.log(order);
          this.dataSource= new MatTableDataSource (res);       
          return order;  
        });
      }),
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLowerCase();
  }
  handleViewAction(values:any){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data={
      data:values
    }
    dialogConfig.width="100%";
    console.log(dialogConfig);
    
    const dialogRef = this.dialog.open(ViewbillproductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }

  
  deleteBill(id: any) {
    Swal.fire({
      icon:"warning",
      title:"Do you want to delete?",
      confirmButtonText:"Delete",
      showCancelButton:true,
    }).then((result)=>{
      if(result.isConfirmed){
        //delete
        this.orderService.deleteBill(id).subscribe(
          (data:any)=>{
            // this.quizzes=this.quizzes.filter((quiz:any)=>quiz.qid!=qId)
            this.tableData();
            this.toastr.success('Success!','Bill deleted successfully');
          },
          (error)=>{
            console.log(error);
            this.toastr.error('Error','Error in deleting bill');
          }
        );
      }
    })
  }

  downloadReportAction(values: any) {

    var data = {
      name: values.name,
      email: values.email,
      uuid: values.uuid,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      totalAmount: values.totalAmount,
      orderType:values.orderType,
      productDetail: JSON.stringify(values.productDetail)
    }
    this.downloadFile(values.uuid, data);
  }
  downloadFile(fileName: string, data: any) {
    console.log(data);
    
    // this.orderService.addBill(data).subscribe((response: any) => {

    //   saveAs(response, fileName + '.pdf');
    // })
    this.orderService.addBill(data).subscribe((response: any) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      saveAs(blob, fileName + '.pdf');
    });
    
  }

  getRole(){
    return this.authService.getRole();
  }

  handleReviewAction(values:any){
    const dialogConfig=new MatDialogConfig();
    dialogConfig.data={
      data:values
    }
    dialogConfig.width="100%";
    console.log(dialogConfig);
    
    const dialogRef = this.dialog.open(RatereviewComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
}

