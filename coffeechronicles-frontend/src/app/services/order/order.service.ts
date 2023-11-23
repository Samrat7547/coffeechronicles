import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Order from 'src/app/model/Order';
import Orders from 'src/app/model/Orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8085/bill';
  private orderData: Order[] = [];
  private orderDataSubject = new BehaviorSubject<Order[]>(this.orderData);

  getOrderData() {
    return this.orderDataSubject.asObservable();
  }

  createTransaction(amount:any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/transaction/${amount}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addToOrder(orderItem: Order) {
    this.orderData.push(orderItem);
    this.orderDataSubject.next(this.orderData);
  }
  constructor(private http: HttpClient) {}

  addBill(orders: Orders): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/generate`, orders, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllBills(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  deleteBill(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
