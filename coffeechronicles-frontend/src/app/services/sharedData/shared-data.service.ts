import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }
  private userDetailsSetSource = new Subject<boolean>();
  userDetailsSet$ = this.userDetailsSetSource.asObservable();
  private userDetailsSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('userDetails') as string)
  );
  public userDetailsObservable = this.userDetailsSubject.asObservable();

  setUserDetails(userDetails: any): void {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    this.userDetailsSubject.next(userDetails);
    this.userDetailsSetSource.next(true);
  }
}
