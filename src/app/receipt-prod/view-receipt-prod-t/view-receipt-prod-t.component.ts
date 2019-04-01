import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';
import { ProdMaster } from '../../shared/models/production';

@Component({
  selector: 'app-view-receipt-prod-t',
  templateUrl: './view-receipt-prod-t.component.html',
  styleUrls: ['./view-receipt-prod-t.component.css']
})
export class ViewReceiptProdTComponent implements OnInit, AfterViewInit {
  @Input('prodData') prodData: ProdMaster[] = [];
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
    this.prodMaster = this.prodData;
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
    
    this.dtTrigger.next();
    // this.userID = this.auth.getUserID();
    //this.getProdMaster();
  }
  ngAfterViewInit() {
    this.prodMaster = this.prodData;
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
    
    this.dtTrigger.next();
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
