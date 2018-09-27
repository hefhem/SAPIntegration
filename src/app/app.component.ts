import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';
import * as decode from 'jwt-decode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  td: any;
  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {
    const tv = this.authService.isTokenValid();
    if (!tv) {
        this.route.navigate(['/login']);
    // } else {
    //   this.route.navigate(['/login']);
    }
    // this.route.navigate(['']);
  }

}
