import { Component, OnInit } from '@angular/core';
import * as decode from 'jwt-decode';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { UserRole } from '../shared/models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string;
  isAdmin: boolean;
  cls = 'd-none';
  userRole: UserRole = new UserRole();
  constructor(public auth: AuthService, private router: Router) {
    // this.getUserRole();
    // if (this.auth.isAdmin()) {
    //   this.cls = '';
    // }
    // this.userName = this.auth.getUserName();
  }

  ngOnInit() {
    const tv = this.auth.isTokenValid();
    // this.auth.setAPIUrl();
    if (!tv) {
        this.router.navigate(['/login']);
        return;
    }
    // // console.log(this.auth.isAdmin());
    // if (this.auth.isAdmin()) {
    //   this.cls = '';
    // }
    this.userName = this.auth.getUserName();
    this.auth.getUserRight(this.userName);
    // this.userRole = this.auth.getUserRight(this.userName);
    // console.log(this.userRole.IsAdmin);
    // console.log(this.userRole.IsAdmin, this.userName);
    this.userName = this.userName.charAt(0).toUpperCase() + this.userName.substr(1);
    // this.getUserRole();
  }

  logout() {
    this.auth.removeToken();
    this.router.navigate(['/login']);
    window.location.href = '/';
  }

}
