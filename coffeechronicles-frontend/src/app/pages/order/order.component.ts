import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import * as Razorpay from 'razorpay';

import Order from 'src/app/model/Order';
import Orders from 'src/app/model/Orders';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { OrderService } from 'src/app/services/order/order.service';
import { SharedDataService } from 'src/app/services/sharedData/shared-data.service';

declare var Razorpay:any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  userDetails!: any;
  newOrderForm!: FormGroup;
  order: Order[]=[];
  selectedOrderType: string = '';
  selectedPaymentMethod: string = '';
  items!: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private orderService: OrderService,
    private authService: AuthService,
    private sharedDataService: SharedDataService,
    private menuService: MenuService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.sharedDataService.userDetailsObservable.subscribe((userDetails) => {
      this.userDetails = userDetails;
    });
    this.newOrderForm = this.fb.group({
      food: [''],
      quantity: [''],
      orderType: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });
    this.getProducts();
    this.orderService.getOrderData().subscribe((orderData) => {
      this.order = orderData;
      console.log(this.order)
    });
  }

  decreaseQuantity(index: number) {
    if (parseInt(this.order[index].quantity) > 1) {
      this.order[index].quantity = (
        parseInt(this.order[index].quantity) - 1
      ).toString();
      this.order[index].total = (
        parseInt(this.order[index].price) * parseInt(this.order[index].quantity)
      ).toFixed(2);
    }
  }

  increaseQuantity(index: number) {
    this.order[index].quantity = (
      parseInt(this.order[index].quantity) + 1
    ).toString();
    this.order[index].total = (
      parseInt(this.order[index].price) * parseInt(this.order[index].quantity)
    ).toFixed(2);
  }

  removeItem(index: number) {
    this.order.splice(index, 1);
  }

  // addFood() {
  //   const currentOrder = this.newOrderForm.value;
  //   if (currentOrder.food != '' && currentOrder.quantity != '') {
  //     if (parseInt(currentOrder.quantity) < 1) {
  //       this.toastr.warning(
  //         'Number of items must be at least one',
  //         'Invalid quantity'
  //       );
  //     } else {
  //       this.newOrderForm = this.fb.group({
  //         food: [''],
  //         quantity: [''],
  //         orderType: [this.selectedOrderType, Validators.required],
  //         paymentMethod: [this.selectedPaymentMethod, Validators.required],
  //       });

  //       const foodAndPrice = currentOrder.food;
  //       const [food, pr] = foodAndPrice.split(' - ');
  //       const price = parseFloat(pr).toFixed(2);
  //       const quantity = currentOrder.quantity;
  //       const singleOrder: Order = {
  //         name: food,
  //         price: price.toString(),
  //         quantity: quantity.toString(),
  //         total: (parseFloat(price) * quantity).toFixed(2),
  //       };
  //       this.order.push(singleOrder);
        
  //     }
      
  //   } else {
  //     this.toastr.warning(
  //       'Please choose both food option and the quantity',
  //       'Invalid item'
  //     );
  //   }
    
  // }
  addFood() {
    const currentOrder = this.newOrderForm.value;
    if (currentOrder.food != '' ) {
      // If quantity is not provided or less than 1, set it to 1
      // let quantity = currentOrder.quantity ? parseInt(currentOrder.quantity) : 1;
      let quantity = currentOrder.quantity ? Math.max(1, parseInt(currentOrder.quantity)) : 1;

  
      this.newOrderForm = this.fb.group({
        food: [''],
        quantity: [quantity], // Set to 1 if not provided or less than 1
        orderType: [this.selectedOrderType, Validators.required],
        paymentMethod: [this.selectedPaymentMethod, Validators.required],
      });
  
      const foodAndPrice = currentOrder.food;
      const [food, pr] = foodAndPrice.split(' - ');
      const price = parseFloat(pr).toFixed(2);
      
      const singleOrder: Order = {
        name: food,
        price: price.toString(),
        quantity: quantity.toString(),
        total: (parseFloat(price) * quantity).toFixed(2),
      };
      
      this.order.push(singleOrder);
    } else {
      this.toastr.warning(
        'Please choose both food option and the quantity',
        'Invalid item'
      );
    }
  }
  

  calculateSubtotal(): string {
    const sumTotal = this.order.reduce((acc, order) => {
      return acc + parseFloat(order.total);
    }, 0);
    return sumTotal.toFixed(2);
  }

  onOrderTypeChange(event: any) {
    this.selectedOrderType = event.target.value;
  }

  onPaymentMethodChange(event: any) {
    this.selectedPaymentMethod = event.target.value;
  }

  submitOrder() {
    if (this.order.length === 0) {
      this.toastr.warning(
        'You did not add any food item',
        'Please add some food options'
      );
    } else {
      console.log(this.order);
      const orders: Orders = {
        createdBy: this.userDetails.userName.toString(),
        email: this.userDetails.email.toString(),
        // firstName: this.userDetails.firstName.toString(),
        // lastName: this.userDetails.lastName.toString(),
        name: `${this.userDetails.firstName} ${this.userDetails.lastName}`,
        contactNumber:this.userDetails.phone.toString(),
        orderType: this.selectedOrderType.toString(),
        paymentMethod: this.selectedPaymentMethod.toString(),
        productDetail: JSON.stringify(this.order),
        totalAmount: this.calculateSubtotal().toString(),
      };
      console.log(orders);
      // this.order = [];
      // this.newOrderForm = this.fb.group({
      //   food: [''],
      //   quantity: [''],
      //   orderType: ['', Validators.required],
      //   paymentMethod: ['', Validators.required],
      // });
      // this.orderService.addBill(orders).subscribe(
      //   (res: any) => {
      //     this.toastr.success('Your order is placed!', 'Order successful');
      //     console.log(res);
      //   },
      //   (error: HttpErrorResponse) => {
      //     this.toastr.success('Your order is placed!', 'Order successful');
      //     console.log(error);
      //   }
      // );
      // console.log(orders.totalAmount);
      if (this.selectedPaymentMethod === 'credit card' || this.selectedPaymentMethod === 'debit card') {
        let amount= parseFloat(orders.totalAmount);
        
        this.orderService.createTransaction(amount).subscribe(
            (response)=>{
              console.log(response);
              this.openTransactionModal(response);

            },
            (error)=>{
              console.log(error);
              
            }
        );
        
      }
      else{
        console.log("bad");
        this.order = [];
        this.newOrderForm = this.fb.group({
          food: [''],
          quantity: [''],
          orderType: ['', Validators.required],
          paymentMethod: ['', Validators.required],
        });
        this.orderService.addBill(orders).subscribe(
        (res: any) => {
          this.toastr.success('Your order is placed!', 'Order successful');
          console.log(res);
          this.router.navigate(['/order']);

          // Reload the window after 2 seconds
          // setTimeout(() => {
          //   window.location.reload();
          // }, 2000);
         
        },
        (error: HttpErrorResponse) => {
          this.toastr.success('Your order is placed!', 'Order successful');
          console.log(error);
        }
      );
      }


    }
  }

  getProducts() {
    this.menuService.getProducts().subscribe(
      (res: any) => {
        // console.log(res);
        this.items = res;
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  openTransactionModal(response:any){
    var options={
      order_id:response.orderId,
      key:response.key,
      amount:response.amount,
      currency:response.currency,
      name:`${this.userDetails.firstName} ${this.userDetails.lastName}`,
      description: 'Coffee Chronicles',
      image: 'https://cdn.pixabay.com/photo/2016/09/05/18/49/plastic-card-1647376_640.jpg',
      handler:(response:any)=>{
        // this.processResponse(response);
        if(response!= null && response.razorpay_payment_id != null) {
          this.processResponse(response);
          console.log("done");

         
          
            console.log(this.order);
            const orders: Orders = {
              createdBy: this.userDetails.userName.toString(),
              email: this.userDetails.email.toString(),
              // firstName: this.userDetails.firstName.toString(),
              // lastName: this.userDetails.lastName.toString(),
              name: `${this.userDetails.firstName} ${this.userDetails.lastName}`,
              contactNumber:this.userDetails.phone.toString(),
              orderType: this.selectedOrderType.toString(),
              paymentMethod: this.selectedPaymentMethod.toString(),
              productDetail: JSON.stringify(this.order),
              totalAmount: this.calculateSubtotal().toString(),
            };
            console.log(orders);
            
            this.orderService.addBill(orders).subscribe(
              (res: any) => {
                this.toastr.success('Your order is placed!', 'Order successful');
                this.order = [];
            this.newOrderForm = this.fb.group({
              food: [''],
              quantity: [''],
              orderType: ['', Validators.required],
              paymentMethod: ['', Validators.required],
            });
                console.log(res);
                // setTimeout(() => {
                //   window.location.reload();
                // }, 3000);
              },
              (error: HttpErrorResponse) => {
                this.toastr.success('Your order is placed!', 'Order successful');
                console.log(error);
              }
            );
          
          
        } else {
          this.toastr.error('Error', 'Payment Failed!!');
          console.log("error");
          
        }
       
      },
      prefill: {
        name:`${this.userDetails.firstName} ${this.userDetails.lastName}`,
        email: this.userDetails.email.toString(),
        contact:this.userDetails.phone.toString(),
      },
      notes:{
        address:'',

      },
      theme:{
        color:'#F37254'
      }
    };
    var razorPayObject= new Razorpay(options);
    razorPayObject.open();
  }
  processResponse(resp:any){
    console.log(resp);
  }
}

