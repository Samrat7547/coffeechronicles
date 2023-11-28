import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8085/review';
  constructor(private http: HttpClient) {}

  getReviews(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/allReview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  addReview(review: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/add`, review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getReviewOfProducts(pid:any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/product/${pid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
}
