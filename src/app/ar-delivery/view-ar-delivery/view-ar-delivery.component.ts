import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { DeliveryMaster } from '../../shared/models/delivery';

@Component({
  selector: 'app-view-ar-delivery',
  templateUrl: './view-ar-delivery.component.html',
  styleUrls: ['./view-ar-delivery.component.css']
})
export class ViewArDeliveryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  endpoint = 'api/nGetDelivery';
  deliveryMaster: DeliveryMaster[] = [];
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
      // destroy: true
    };
    // this.userID = this.auth.getUserID();
    this.getDeliveryMaster();
  }

  getDeliveryMaster() {
    this.auth.loading = true;
    this.deliveryMaster = [];
    this.handleAPI.get(this.endpoint)
      .subscribe( (data: any) => {
          // console.log(data);
          this.deliveryMaster = data;
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
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
    this.router.navigate(['/ar-delivery', id]);
  }
}

