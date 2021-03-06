import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { HandleAPIService } from '../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { COA, COADetail, COAType } from '../shared/models/coa';

@Component({
  selector: 'app-coa',
  templateUrl: './coa.component.html',
  styleUrls: ['./coa.component.css']
})
export class COAComponent implements OnInit {
  coa: COA = new COA();
  coa_detail: COADetail = new COADetail();
  coa_details: COADetail[] = [];
  cod: COADetail = new COADetail();
  coaType: COAType[] = [];
  formValid = false;
  print = false;
  saveBtn = '';
  lineCount = -1;
  userName = '';
  itemDetail = [];
  closeResult: string;
  currentDate: number;
  coaDate: any;
  spincls = '';
  id = 0;
  userID = 1;
  lbl = false;
  userRole: any;
  addBtn = 'Add';
  constructor(
    private modalService: NgbModal,
    private handleAPI: HandleAPIService,
    private toastr: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar
  ) { }

  ngOnInit() {
    const tv = this.auth.isTokenValid();
    if (!tv) {
        this.router.navigate(['/login']);
        return;
    }
    this.userName = this.auth.getUserName();
    this.id = this.route.snapshot.params['id'];
    if (this.id > 0) {
      this.getCOAByID(this.id);
      this.getCOAType();
    } else {
      // this.currentDate = Date.now();
      // this.coaDate = this.calendar.getToday();
      // this.coa.DocDate = new Date(Date.UTC(this.coaDate.year, this.coaDate.month - 1, this.coaDate.day, 0, 0, 0, 0));
      // console.log(this.goodsReceiptMaster.ProdDate);
      // console.log(this.prodDate);
      this.coa.CreatedBy = this.userName;
      this.getCOAType();
    }
    // console.log(this.auth.userRole);
  }
  getCOAByID(id: any) {
    // console.log('hello');
    this.auth.loading = true;
    // tslint:disable-next-line:triple-equals
    // if (this.goodsReceiptMaster.DocNum != '') {
      this.handleAPI.get('api/GetCOAByID/' + id)
        .subscribe( (data: any) => {
          // console.log(data);
          if (data.coa != null) {
            this.auth.loading = false;
            this.coa = data.coa;
            this.coa_details = data.COADetails;
            this.auth.loading = false;
            this.print = true;
            this.formValid = false;
          } else {
            this.toastr.warning('No record found!');
              this.resetForm(true);
          }
          this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
    // } else {
    //   this.auth.loading = false;
    // }
  }
  getCOAType() {
    // console.log('hello');
    //this.auth.loading = true;
    // tslint:disable-next-line:triple-equals
    // if (this.goodsReceiptMaster.DocNum != '') {
      this.handleAPI.get('api/GetCOAType')
        .subscribe( (data: any) => {
          //console.log(data);
          this.coaType = data;
          //this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          //this.auth.loading = false;
        }
      );
    // } else {
    //   this.auth.loading = false;
    // }
  }
  getSAPDeliveryDetails() {
    // console.log('hello');
    // tslint:disable-next-line:triple-equals
    if (this.coa.SAPDocNum == null || this.coa.SAPDocNum.trim() == '') {
      this.resetForm(true);
      return;
    }
    this.auth.loading = true;
    this.spincls = 'fa-spin';
    // tslint:disable-next-line:triple-equals
    if (this.coa.SAPDocNum != null || this.coa.SAPDocNum.trim() != '') {
      this.handleAPI.get('api/GetSAPDeliveryDetails/' + this.coa.SAPDocNum)
        .subscribe( (data: any) => {
            console.log(data);
            // this.goodsReceiptMaster = data;
            if (data.coaMaster.CardCode == null) {
              this.toastr.warning('No record found!');
            } else {
              this.coa.CustomerName = data.coaMaster.CustomerName;
              this.coa.DocDate = data.coaMaster.DocDate;
              this.coa.SAPDocNum = data.coaMaster.SAPDocNum;
              this.itemDetail = data.coaDetails;
            }
            // tslint:disable-next-line:max-line-length
            // this.OpenQty = (this.goodsReceiptMaster.PlannedQty - this.goodsReceiptMaster.CompletedQty) < 0 ? 0 : (this.goodsReceiptMaster.PlannedQty - this.goodsReceiptMaster.CompletedQty);
            this.auth.loading = false;
            this.spincls = '';
          },
          error => {
            this.toastr.warning(error, 'Oops! An error occurred');
            this.auth.loading = false;
          }
      );
    } else {
      this.auth.loading = false;
      this.spincls = '';
    }
  }
  setDate() {
    this.coa.DocDate = new Date(this.coaDate.year + '-' + this.coaDate.month + '-' + this.coaDate.day);
    // console.log(this.goodsReceiptMaster.ProdDate);
  }
  open(content) {
    // this.setLabelValue(idt, this.printRecord);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    setTimeout(() => { this.printRecord('print-section'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
    // this.modalService.dismissAll();
  }
  setLabelValue(idt: COADetail, callback) {
    
  }
  getItemDetails(event: any){
    //console.log(event.target.value);
    const code = event.target.value;
    const item = this.itemDetail.find( x => x.ItemCode == code);
    this.coa.ItemName = item.ItemName;
    this.coa.Quantity = item.Quantity;
    this.coa.UOM = item.UOM;
  }
  openModal(content, sz: any = 'lg') {
    this.cod = new COADetail();
    this.addBtn = 'Add'
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }
  openModalEdit(content, idt: COADetail, sz: any = 'sm') {
    this.cod = idt;
    if (idt.COADetailID > 0){
      this.addBtn = 'Update';
    } else {
      this.addBtn = 'Done';
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }

  printRecord(elem: any): void {
    let printContents, popupWin;
    printContents = document.getElementById(elem).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
          <link rel="stylesheet" href="../assets/css/fontawesome-all.css">
          <style>
          .table1 {
            height:90%;
            width:100%;
            font-size:12pt;
          }
          td {
            //height:50px;
            //text-align:left;
          }
          </style>
        </head>
        <body onload="window.print();window.close()">
        <!--<div class="row">-->
          <!--<div class="col-md-12">-->
          ${printContents}
          <!--</div>-->
        <!--</div>-->
        </body>
      </html>`
    );
    popupWin.document.close();
    this.lbl = false;
  }

  resetForm(silent = false) {
    if (!silent) {
      if (!confirm('This will clear all records, do you want to proceed?')) {
        return;
      }
    }
    this.router.navigate(['/coa']);
    this.coa = new COA();
    this.coa_detail = new COADetail();
    this.coa_details = [];
    this.formValid = false;
    this.print = false;
    this.saveBtn = '';
    this.currentDate = Date.now();
    this.coaDate = this.calendar.getToday();
    this.coa.CreatedBy = this.userName;
  }
  saveRecord() {
    if (!confirm('Are you sure you want to save?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.coa.SAPDocNum == null || this.coa.SAPDocNum.trim() == '') {
      this.toastr.warning('Delivery number is required.', 'Validation Error!');
      return;
    }
    if (this.coa.DocDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (this.coa.COA_ID !== 0) {
      this.toastr.warning('Record already posted', 'Validation Error!');
      return;
    }
    this.saveBtn = 'disabled';
    this.auth.loading = true;
    // this.coa.DocDate = new Date(Date.UTC(this.coaDate.year, this.coaDate.month - 1, this.coaDate.day, 0, 0, 0, 0));
    // console.log(this.goodsReceiptMaster.ProdDate);
    const dt = {
      coa: this.coa,
      COADetails: this.coa_details
    };
    this.handleAPI.create(dt, 'api/AddCOA')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('COA created!', 'Success');
          // console.log(data);
          this.print = true;
          // this.isPostable = true;
          this.coa.COA_ID = data.ID;
          this.formValid = false;
          this.saveBtn = '';
          this.router.navigate(['/coa/'+ data.ID])
        } else {
          this.toastr.warning(data.Response);
        }
          this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
  }
  approveCOA() {
    if (!confirm('Are you sure you want to approve this document?')) {
      return;
    }
    this.auth.loading = true;
    const id = this.coa.COA_ID;
    const obj = {
      Username: this.userName,
      ObjectID: id
    }
    this.handleAPI.create(obj, 'api/ApproveCOA')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Document approved successfully!', 'Success');
          console.log(data);
          this.coa.IsApproved = true;
          this.auth.loading = false;
        } else {
          this.toastr.warning(data.Response, 'Warning');
          console.log(data);
          this.auth.loading = false;
        }
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
  }
  addToList(){
    if(this.cod.COADetailID > 0){
      this.handleAPI.create(this.cod, 'api/EditCOADetails')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Row updated successfully!', 'Success');
          //console.log(data);
        } else {
          this.toastr.warning(data.Response, 'Warning');
          //console.log(data);
        }
        this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
    } else {
      if (this.addBtn == 'Done'){
        this.modalService.dismissAll();
      } else {
        const cc = this.coa_details.filter( x => x.COATypeID == this.cod.COATypeID);
        if(cc.length > 0){
          this.toastr.warning('Item exists in the list','Validation Error!');
          return;
        }
        const cot = this.coaType.filter(x => x.COATypeID == this.cod.COATypeID)[0];
        this.cod.COATypeName = cot.COATypeName;
        this.coa_details.push(this.cod);
        this.cod = new COADetail();
        this.print = true;

      }
    }
  }
  deleteTest(idt: COADetail){
    if(!confirm('Are you sure you want to remove this record?')){
      return;
    }
    if (idt.COADetailID > 0){
      const obj = {
        Username: this.userName,
        ObjectID: idt.COADetailID
      }
      this.handleAPI.create(obj, 'api/DeleteCOADetail')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Row deleted successfully!', 'Success');
          const i = this.coa_details.indexOf(idt);
          if (i !== -1) {
            this.coa_details.splice(i, 1);
          }
              //console.log(data);
        } else {
          this.toastr.warning(data.Response, 'Warning');
          //console.log(data);
        }
        this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
    } else {
      const i = this.coa_details.indexOf(idt);
  
      if (i !== -1) {
        this.coa_details.splice(i, 1);
      }
    }
  }
}

