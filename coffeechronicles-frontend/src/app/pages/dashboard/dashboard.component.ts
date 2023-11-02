import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  allOrders$!: Observable<any>;
  ordersLength: number = 0;
  menuItems!: any;
  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getAllMenuItems();
    // This line initializes an observable named 'allOrders$' by calling the getAllBills method of the 'orderService'.
    // The observable is created by piping a series of operators: 'map' and 'catchError'.
    this.allOrders$ = this.orderService.getAllBills().pipe(
      // The 'map' operator is used to transform each emitted value from the observable stream.
      // In this case, 'map' operator transforms the response object into an array of orders.
      map((res: any) => {
        // Each order's productDetail property is parsed from a JSON string into an object using 'JSON.parse'.
        // The transformed order is returned back to the map operator.
        this.ordersLength = res?.length;
        // console.log(this.ordersLength);

        return res.map((order: any) => {
          order.productDetail = JSON.parse(order.productDetail);
          return order;
        });
      }),

      // The 'catchError' operator is used to catch any errors that might occur while processing the observable.
      // It logs the error to the console and returns an observable of null.
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
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
}

