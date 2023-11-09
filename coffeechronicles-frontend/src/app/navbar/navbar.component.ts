import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
import { SharedDataService } from '../services/sharedData/shared-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../pages/signup/signup.component';
import { LoginComponent } from '../pages/login/login.component';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  menuIsOpen: boolean = false;
  userDetails!: any;
  showMenu: boolean = false;
  userNameClass = 'user-name';


  constructor(
    private sharedDataService: SharedDataService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.sharedDataService.userDetailsObservable.subscribe((userDetails: any) => {
      this.userDetails = userDetails;
    });
    // console.log(this.userDetails);
  }
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logOut() {
    this.authService.logout();
    this.sharedDataService.setUserDetails('');
    // this.sharedDataService.setUserRole('');
    this.toastr.info('You are logged out', 'Log out successful');
    this.router.navigate(['/home']);
  }

  getRole() {
    return this.authService.getRole();
  }


  closeMenuOnLeave() {
    if (this.menuIsOpen) {
      this.menuTrigger.closeMenu();
      this.menuIsOpen = false;
    }
  }

  
  
  
}

