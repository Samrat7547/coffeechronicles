import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8085/bill';
  constructor(private http: HttpClient) {}

  addBill(orders: any): Observable<any> {
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
}
