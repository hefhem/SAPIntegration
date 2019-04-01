import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { ProdMaster } from '../../shared/models/production';

@Component({
  selector: 'app-view-receipt-prod',
  templateUrl: './view-receipt-prod.component.html',
  styleUrls: ['./view-receipt-prod.component.css']
})
export class ViewReceiptProdComponent implements OnInit {
  dtOptions:any = {};
  endpoint = 'api/GetPRByDate';
  prodMaster: ProdMaster[] = [];
  userID: any;
  fromDate: any;
  toDate: any;
  fDate: Date;
  tDate: Date;
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
      pageLength: 50,
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
    //this.getProdMaster();
  }
  setFromDate() {
    this.fDate = new Date(Date.UTC(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day, 0, 0, 0, 0));
    // console.log(this.prodMaster.ProdDate);
  }
  setToDate() {
    this.tDate = new Date(Date.UTC(this.toDate.year, this.toDate.month - 1, this.toDate.day, 0, 0, 0, 0));
    // console.log(this.prodMaster.ProdDate);
  }
  getProdMaster() {
    this.auth.loading = true;
    this.prodMaster = [];
    this.fDate = new Date(Date.UTC(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day, 0, 0, 0, 0));
    this.tDate = new Date(Date.UTC(this.toDate.year, this.toDate.month - 1, this.toDate.day, 0, 0, 0, 0));
    let dr = {
      FromDate: this.fDate,
      ToDate: this.tDate
    };
    // setTimeout(() => {
    //   dr = {
    //     FromDate: this.fDate,
    //     ToDate: this.tDate
    //   };
    // }, 300);
    this.handleAPI.create(dr, this.endpoint)
      .subscribe( (data: any) => {
          // console.log(data);
          
          this.prodMaster = [];
          // setTimeout(() => {
          //   this.prodMaster = data.filter(x => !x.IsPosted && x.Status !== 'C');
          // }, 300);
          //this.prodMaster = data.filter(x => !x.IsPosted && x.Status !== 'C');
          this.prodMaster = data.filter(x => x.Status !== 'C');
          //this.dtTrigger.next();
          this.dtOptions = {
            destroy: true,
            pagingType: 'full_numbers',
            pageLength: 50,
            dom: 'Bfrtip',
            // Configure the buttons
            buttons: [
              'copy',
              'print',
              'excel'
            ],
            
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
    this.router.navigate(['/receipt-prod', id]);
  }

  // reverseInvoice(inv: Invoice) {
  //   if (confirm('Are you sure you want to cancel this Invoice ' + inv.invoiceNumber + ' ?')) {
  //     this.handleAPI.deleteWithUserID(inv.invoiceMasterID, 'api/Invoice', this.userID )
  //       .subscribe( data => {
  //           this.toastr.success('Invoice cancelled', 'Success');
  //           this.getInvoices();
  //           // console.log(data);
  //         },
  //         error => {
  //           if (error.object) {
  //             this.toastr.warning('Please check the console.', 'Oops! An error occurred');
  //           } else {
  //             this.toastr.warning(error, 'Oops! An error occurred');
  //           }
  //         }
  //     );
  //  }
  // }

}
