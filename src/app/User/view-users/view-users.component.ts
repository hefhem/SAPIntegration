import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserRole } from '../../shared/models/user';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  uRole: UserRole = new UserRole();
  userRoles: UserRole[] = [];
  endpoint = 'api/User';
  tokenData: any;
  userID: any;
  btn = 'Add';

  constructor(
    private handleAPI: HandleAPIService,
    private toastr: ToastrService,
    private authService: AuthService,
  private router: Router) { }

  ngOnInit() {
    const tv = this.authService.isTokenValid();
    if (!tv) {
        this.router.navigate(['/login']);
    }
    // if (!this.authService.isAdmin()) {
    //   // this.toastr.warning('', 'Access Denied!');
    //   // this.router.navigate(['']);
    //     return;
    // }
    // this.userID = this.authService.getUserID();
    this.getUserRoles();
  }

  onUpdate(dt: UserRole) {
    this.authService.loading = true;
    this.handleAPI.create(dt, 'api/UpdateUserRole')
      .subscribe( (data: any) => {
          if (data.IsSuccess) {
            this.toastr.success('User Role Updated!', 'Success');
            // this.userRole = new UserRole();
          }
          // this.getUsers();
          this.authService.loading = false;
        },
        error => {
          if (error.object) {
            this.toastr.warning('Please check the console.', 'Oops! An error occurred');
          } else {
            this.toastr.warning(error, 'Oops! An error occurred');
          }
          this.authService.loading = false;
        }
      );
  }
  getUserRoles() {
    this.authService.loading = true;
    this.handleAPI.get('api/GetUserRoles')
      .subscribe( (data: any) => {
        // console.log(data);
          this.userRoles = data;
          this.authService.loading = false;
        },
        error => {
          if (error.object) {
            this.toastr.warning('Please check the console.', 'Oops! An error occurred');
          } else {
            this.toastr.warning(error, 'Oops! An error occurred');
          }
          this.authService.loading = false;
        }
    );
  }
}


