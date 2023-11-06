import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:8085/category';
  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/allCategory`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  addCategory(category: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.baseUrl}/add`, category, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateCategory(category: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.baseUrl}/update`, category, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteCategory(cid: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}/${cid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}


