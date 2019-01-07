import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { ProdMaster } from '../../shared/models/production';

@Component({
  selector: 'app-view-prod-summary',
  templateUrl: './view-prod-summary.component.html',
  styleUrls: ['./view-prod-summary.component.css']
})
export class ViewProdSummaryComponent implements OnInit {

  dtOptions: any = {};
  endpoint = 'api/GetProductionSummary';
  prodSummary = [];
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
    this.getProdSummary();
  }

  getProdSummary() {
    this.auth.loading = true;
    this.prodSummary = [];
    this.handleAPI.get(this.endpoint)
      .subscribe( (data: any) => {
          // console.log(data);
          this.prodSummary = data;
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
}
