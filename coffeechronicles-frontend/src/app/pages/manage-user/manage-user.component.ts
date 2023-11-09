import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { ViewUserComponent } from '../view-user/view-user.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit{

  users!: any;

  constructor(
    private toastr: ToastrService,
    private auth: AuthService,
    public dialog: MatDialog,
    public authService:AuthService
  ) {}

  ngOnInit(): void {
    this.fetchUserData()
  }

  fetchUserData(){
    this.auth.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
         // Convert status to boolean for each user
        //  this.users.forEach((user: any) => {
        //   user.status = Boolean(user.status);
        // });
        // Convert status to boolean for each user
        this.users.forEach((user: any) => {
          user.status = user.status === "true";
        });
        console.log(this.users);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteUser(Id: any) {
    // alert(qId);
    Swal.fire({
      icon: 'warning',
      title: 'Do you want to delete?',
      confirmButtonText: 'Delete',
      showCancelButton: true,
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        //delete
        this.auth.deleteUser(Id).subscribe(
          (data: any) => {
            this.users = this.users.filter((user: any) => user.id != Id);
            this.toastr.success('Success!', 'User deleted successfully');
          },
          (error) => {
            // console.log(error);
            // this.toastr.error('Error','Error in deleting quiz');
            if (error.error.text === 'User was deleted successfully') {
              this.users = this.users.filter((user: any) => user.id != Id);
              this.toastr.success('Success!', 'User deleted successfully');
            } else {
              this.toastr.error('Error', 'Error in deleting user');
            }
          }
        );
      }
    });
  }

  openDialog(
    id: any,
    userName: any,
    firstName: any,
    lastName: any,
    email: any,
    phone: any,
    status: any
  ) {
    const dialogRef = this.dialog.open(ViewUserComponent, {
      data: {
        id: id,
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        status: status,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  toggleUserStatus(user: any,event: MatSlideToggleChange) {
    
    
    user.status = event.checked;
    
    // Convert status to string before sending to backend
    const statusString = user.status ? "true" : "false";
    console.log(user);
    
    this.authService.update(user.id, statusString).subscribe(
      (result: any) => {
        this.toastr.success('Success!', 'User updated');
        console.log(result);
        
      },
      (error: any) => {
        // Handle error
        // You might want to reset the status in case of an error
        user.status = !event.checked;
        this.toastr.error('Error', 'Error in updating user');
        console.log(error);
        
      }
    );
  }
}
