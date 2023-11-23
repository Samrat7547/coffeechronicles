import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-viewbillproducts',
  templateUrl: './viewbillproducts.component.html',
  styleUrls: ['./viewbillproducts.component.css']
})
export class ViewbillproductsComponent implements OnInit{

  dataplayedColumns: string[] = ['name', 'price', 'quantity', 'total'];
  dataSource: any;
  data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewbillproductsComponent>) { }

  ngOnInit() {
    console.log(this.dialogData.data.productDetail);
    this.data = this.dialogData.data;
    this.dataSource = this.dialogData.data.productDetail;
    // this.dataSource = JSON.parse(this.dialogData.data.productDetail);
    // console.log(this.dialogData.data);
  }

}
