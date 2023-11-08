import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = 'http://localhost:8085/product';
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/allProduct`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/add`, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.baseUrl}/update`, product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteProduct(pid: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}/${pid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getActiveProducts(cid:any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/category/active/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getCategoryProducts(cid:any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/category/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
