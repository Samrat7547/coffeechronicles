import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import User from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8085/user';

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  
  register(user: User) {
    console.log(user);
    
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  login(email: string, password: string) {
    const body = {
      userName: email,
      password: password,
    };
    return this.http.post(`${this.baseUrl}/login`, body);
  }

  sendTokenToBackend(idToken: String): Observable<any> {
    console.log('hiii');

    const url = `${this.baseUrl}/google`;
    return this.http.post(url, idToken);
  }


  changePassword(body:any) {
    const token = localStorage.getItem('token');
    
    return this.http.post(`${this.baseUrl}/changePassword`, body,  {
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  update(id:number, status: string) {
    const token = localStorage.getItem('token');
    const body = {
      id: id,
      status: status,
    };
    return this.http.post(`${this.baseUrl}/update`, body,  {
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (token === null || token === undefined) {
      return false;
    }
    // decode token to check if it's expired
    const isTokenExpired = this.jwtHelper.isTokenExpired(token);
    return !isTokenExpired;
  }

  getRole(): boolean {
    const role = localStorage.getItem('role');
    return role === 'ADMIN';
  }

  getUserDetails(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`http://localhost:8085/user/userDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`http://localhost:8085/user/allUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  public deleteUser(Id: any){
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.baseUrl}/delete/${Id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}


