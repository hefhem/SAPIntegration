import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { GoodsReceiptMaster } from '../../shared/models/production';

@Component({
  selector: 'app-view-goods-receipt',
  templateUrl: './view-goods-receipt.component.html',
  styleUrls: ['./view-goods-receipt.component.css']
})
export class ViewGoodsReceiptComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  endpoint = 'api/GetGoodsReceiptMaster';
  goodsReceiptMaster: GoodsReceiptMaster[] = [];
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
    this.getGoodsReceiptMaster();
  }

  getGoodsReceiptMaster() {
    this.auth.loading = true;
    this.goodsReceiptMaster = [];
    this.handleAPI.get(this.endpoint)
      .subscribe( (data: any) => {
          // console.log(data);
          this.goodsReceiptMaster = data;
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

