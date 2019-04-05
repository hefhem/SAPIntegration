import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { GoodsReceiptMaster } from '../../shared/models/production';
import { COA } from 'src/app/shared/models/coa';

@Component({
  selector: 'app-view-coa',
  templateUrl: './view-coa.component.html',
  styleUrls: ['./view-coa.component.css']
})
export class ViewCOAComponent implements OnInit {

  dtOptions: any = {};
  endpoint = 'api/GetCOA';
  coa: COA[] = [];
  userID: any;
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private handleAPI: HandleAPIService,
    private toastr: ToastrService,
    private router: Router,
  private auth: AuthService) { }

  ngOnInit() {
    const tv = this.auth.isTokenValid();
    if (!tv) {
        this.router.navigate(['/login']);
        return;
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      dom: 'Bfrtip',
      // Configure the buttons
      buttons: [
        'copy',
        'print',
        'excel'
      ],
      // destroy: true
    };
    // this.userID = this.auth.getUserID();
    this.getCOA();
  }

  getCOA() {
    this.auth.loading = true;
    this.coa = [];
    this.handleAPI.get(this.endpoint)
      .subscribe( (data: any) => {
          // console.log(data);
          this.coa = data;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            dom: 'Bfrtip',
            // Configure the buttons
            buttons: [
              'copy',
              'print',
              'excel'
            ],
            destroy: true
          };
          this.dtTrigger.next();
          this.auth.loading = false;
        },
        error => {
          if (typeof error === 'string') {
            this.toastr.warning(error, 'Oops! An error occurred');
          } else {
            this.toastr.warning('Please check the console.', 'Oops! An error occurred');
          }
          this.auth.loading = false;
        }
    );
  }

  viewRecord(id: any) {
    console.log(id);
    this.router.navigate(['/coa', id]);
  }
}

