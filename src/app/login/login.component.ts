import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ClsTokenResponse } from '../shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  clsTokenResponse: ClsTokenResponse = new ClsTokenResponse();
  disabled = false;
  signin = 'Sign In';
  currentDate = new Date().getFullYear();
  account = {
    UserCode: '',
    UserPassword: ''
  };
  constructor(
    private router: Router,
    private auth: AuthService,
    private toastr: ToastrService  ) { }

  ngOnInit() {
    const tv = this.auth.isTokenValid();
    if (tv) {
        this.router.navigate(['']);
        return;
    }
    // this.auth.setAPIUrl();
  }

  doLogin() {
    this.signin = 'Loading';
    this.disabled = true;
    this.auth.login(this.account).subscribe(
      (data: any ) => {
        // console.log(data);
        if (data.IsSuccess) {
          this.auth.saveInLocal('token', data.Token);
          this.auth.saveInLocal('username', data.UserName);
          this.auth.saveInLocal('isAdmin', data.IsAdmin);
          this.auth.getUserRight(data.UserName);
          // this.auth.saveInLocal('userRole');
          this.toastr.success('Authenticated!');
          // window.location.href = '';
          this.router.navigate(['']);
        } else {
            this.toastr.warning(data.Message);
            this.signin = 'Sign In';
            this.disabled = false;
        }
      },
      error => {
        if (typeof error === 'string') {
          this.toastr.error(error, 'Oops! An error occurred');
        } else {
          this.toastr.error('Please check the console.', 'Oops! An error occurred');
        }
        this.signin = 'Sign In';
        this.disabled = false;
      }
    );

  }
}
