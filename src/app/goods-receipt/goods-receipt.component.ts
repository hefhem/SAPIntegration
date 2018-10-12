import { Component, OnInit } from '@angular/core';
import { GoodsReceiptMaster, GoodsReceiptDetail, PostToSAP } from '../shared/models/production';
import {NgbModal, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { HandleAPIService } from '../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserRole } from '../shared/models/user';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  goodsReceiptMaster: GoodsReceiptMaster = new GoodsReceiptMaster();
  goodsReceiptDetail: GoodsReceiptDetail = new GoodsReceiptDetail();
  goodsReceiptDetails: GoodsReceiptDetail[] = [];
  postProd: PostToSAP = new PostToSAP();
  AutoBatch = '';
  AutoQty = null;
  qtyValid = false;
  formValid = false;
  isPostable = false;
  OpenQty = 0;
  print = false;
  saveBtn = '';
  lineCount = -1;
  userName = '';

  elementType = 'svg';
  value = '';
  format = 'CODE128';
  lineColor = '#000000';
  width = 8;
  height = 300;
  pwidth = 5;
  pheight = 150;
  displayValue = false;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 60;
  pfontSize = 30;
  background = '#ffffff';
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10;

  closeResult: string;
  bc_weight: number;
  bc_batchno: string;
  currentDate: number;
  prodDate;
  spincls = '';
  id = 0;
  userID = 1;
  lbl = false;
  userRole: any;
  ProducedQty = 0;
  PostedQty = 0;
  BalanceQty = 0;
  expiry: Date;
  supervisors = [];
  lblName = '';
  ItemArray = [];
  AutoItemName: any;
  AutoWarehouse = '';
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.supervisors
        : this.supervisors.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  ItemName = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term === '' ? []
      : this.ItemArray.filter(v => v.ItemName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )
  formatter = (x: {ItemName: string}) => x.ItemName;
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
      this.getGoodsReceiptMasterDetails(this.id);
    } else {
      this.goodsReceiptMaster.TotalQty = 0;
      this.currentDate = Date.now();
      this.prodDate = this.calendar.getToday();
      this.goodsReceiptMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
      // console.log(this.goodsReceiptMaster.ProdDate);
      // console.log(this.prodDate);
      this.getSupervisors();
      this.getSAPItem();
      this.goodsReceiptMaster.CreatedBy = this.userName;
    }
    // console.log(this.auth.userRole);
  }
  getGoodsReceiptMasterDetails(id: any) {
    // console.log('hello');
    this.auth.loading = true;
    // tslint:disable-next-line:triple-equals
    // if (this.goodsReceiptMaster.DocNum != '') {
      this.handleAPI.get('api/GetGoodsReceipt/' + id)
        .subscribe( (data: any) => {
          // console.log(data);
          if (data.goodsReceiptMaster != null) {
            this.auth.loading = false;
            this.goodsReceiptMaster = data.goodsReceiptMaster;
            this.goodsReceiptDetails = data.goodsReceiptDetails;
            this.auth.loading = false;
            this.print = true;
            this.formValid = false;
            this.isPostable = this.goodsReceiptMaster.IsApproved ? true : false;
          } else {
            this.toastr.warning('No record found!');
              this.resetForm(true);
          }
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
    // } else {
    //   this.auth.loading = false;
    // }
  }
  getSupervisors() {
    // console.log('hello');
    // tslint:disable-next-line:triple-equals
    // if (this.goodsReceiptMaster.DocNum != '') {
      this.handleAPI.get('api/GetSupervisors/')
        .subscribe( (data: any) => {
          // console.log(data);
           this.supervisors = data;
          },
          error => {
           console.log(error);
          }
      );
    // }
  }
  getSAPItem() {
    this.auth.loading = true;
    // this.spincls = 'fa-spin';
      this.handleAPI.get('api/GetSAPItem')
        .subscribe( (data: any) => {
          this.ItemArray = data;
          this.auth.loading = false;
          // this.spincls = '';
          // console.log(this.ItemArray);
          },
          error => {
           console.log(error);
           this.auth.loading = false;
          //  this.spincls = '';
          }
      );
  }
  getOrderDetails() {
    // console.log('hello');
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.DocNum.trim() == '' || this.goodsReceiptMaster.DocNum == null) {
      this.resetForm(true);
      return;
    }
    this.auth.loading = true;
    this.spincls = 'fa-spin';
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.DocNum.trim() != '' || this.goodsReceiptMaster.DocNum != null) {
      this.handleAPI.get('api/GetSAPPR/' + this.goodsReceiptMaster.DocNum)
        .subscribe( (data: any) => {
          // console.log(data);
            // this.goodsReceiptMaster = data;
            if (data.ItemCode == null) {
              this.toastr.warning('No record found!');
            } else {
              this.goodsReceiptMaster.ItemCode = data.ItemCode;
              this.goodsReceiptMaster.DocEntry = data.DocEntry;
              this.goodsReceiptMaster.ItemName = data.ItemName;
              this.goodsReceiptMaster.MachineNo = data.MachineNo;
              this.getSupervisors();
            }
            // tslint:disable-next-line:max-line-length
            // this.OpenQty = (this.goodsReceiptMaster.PlannedQty - this.goodsReceiptMaster.CompletedQty) < 0 ? 0 : (this.goodsReceiptMaster.PlannedQty - this.goodsReceiptMaster.CompletedQty);
            this.auth.loading = false;
            this.spincls = '';
          },
          error => {
            if (typeof error === 'string') {
              this.toastr.warning(error, 'Oops! An error occurred');
            } else {
              this.toastr.warning('Please check the console.', 'Oops! An error occurred');
            }
            this.auth.loading = false;
            this.spincls = '';
          }
      );
    } else {
      this.auth.loading = false;
      this.spincls = '';
    }
  }
  getProducedQty() {
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.DocNum != '') {
      this.handleAPI.get('api/GetProducedQty/' + this.goodsReceiptMaster.DocNum)
        .subscribe( (data: any) => {
          // console.log(data);
            this.ProducedQty = data.ProducedQty;
            this.PostedQty = data.PostedQty;
          },
          error => {
            console.log(error);
          }
      );
    }
  }
  setDate() {
    this.goodsReceiptMaster.ProdDate = new Date(this.prodDate.year + '-' + this.prodDate.month + '-' + this.prodDate.day);
    // console.log(this.goodsReceiptMaster.ProdDate);
  }
  onAddBatch() {
    this.setDate();
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.DocNum == null || this.goodsReceiptMaster.DocNum.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.goodsReceiptMaster.ProdDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.Supervisor == null || this.goodsReceiptMaster.Supervisor == '') {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (this.AutoItemName == null) {
      this.toastr.warning('Please choose an Item');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.AutoWarehouse == null || this.AutoWarehouse == '') {
      this.toastr.warning('Please select a Warehouse');
      return;
    }
    if (!(this.AutoQty > 0)) {
      this.toastr.warning('Quantity must greater than zero(0)');
      return;
    }
    const dt = this.ItemArray.filter( x => x.ItemCode === this.AutoItemName.ItemCode);
    if (!(dt.length > 0) ) {
      this.toastr.warning('The item does not belong to the list of Items');
      return;
    }
    this.goodsReceiptDetail.BatchNo = this.generateBatchNo();
    this.goodsReceiptDetail.Quantity = this.AutoQty;
    this.goodsReceiptDetail.ItemName = this.AutoItemName.ItemName;
    this.goodsReceiptDetail.ItemCode = this.AutoItemName.ItemCode;
    this.goodsReceiptDetail.Warehouse = this.AutoWarehouse;
    // this.goodsReceiptDetail.Line_No = this.lineCount + 1;
    this.goodsReceiptDetails.push(this.goodsReceiptDetail);
    if (!(this.goodsReceiptMaster.TotalQty > 0)) {
      this.goodsReceiptMaster.TotalQty = 0;
    }
    this.goodsReceiptMaster.TotalQty += this.AutoQty;
    this.goodsReceiptDetail = new GoodsReceiptDetail();
    this.AutoWarehouse = '';
    this.AutoBatch = '';
    this.AutoQty = null;
    this.AutoItemName = null;
    this.qtyValid = false;
    this.setDate();
    // tslint:disable-next-line:triple-equals
    this.formValid = true;
  }
  onRemoveBatch(item: GoodsReceiptDetail) {
    if (!confirm('Are you sure you want to remove this Batch?')) {
      return;
    }
    const i = this.goodsReceiptDetails.indexOf(item);

    if (i !== -1) {
      this.goodsReceiptDetails.splice(i, 1);
      this.goodsReceiptMaster.TotalQty = this.goodsReceiptMaster.TotalQty - item.Quantity;
    }
    if (this.goodsReceiptDetails.length < 1) {
      this.formValid = false;
      this.goodsReceiptMaster.TotalQty = 0;
    }
  }
  open(content, idt: GoodsReceiptDetail) {
    this.setLabelValue(idt, this.printRecord);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    setTimeout(() => { this.printRecord('print-section'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
    // this.modalService.dismissAll();
  }
  setLabelValue(idt: GoodsReceiptDetail, callback) {
    this.lbl = true;
    this.lblName = idt.ItemName;
    this.value = idt.BatchNo;
    this.bc_batchno = this.value;
    this.bc_weight = idt.Quantity;
    this.expiry = new Date(this.goodsReceiptMaster.ProdDate);
    // console.log(this.goodsReceiptMaster.ProdDate);
    this.expiry.setDate(this.expiry.getDate() + 365);
  }
  openModalPost(content, sz: any = 'lg') {
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
          .table {
            height:90%;
            width:100%;
            font-size:40pt;
          }
          td {
            height:50px;
            text-align:left;
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

  generateBatchNo() {
    let timestamp = '';
    const now = new Date();

    timestamp = now.getFullYear().toString().substr(2, 2); // 2011
    timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0
    timestamp += this.goodsReceiptMaster.MachineNo.substr(0, 2); // pad with a 0
    timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    timestamp += (now.getMilliseconds() < 100 ? '0' : '') + now.getMilliseconds().toString().substr(0, 3);
    // tslint:disable-next-line:max-line-length
    // timestamp += (parseInt(now.getMilliseconds().toString().substr(1, 2)) < 10 ? '0' : '') + now.getMilliseconds().toString().substr(1, 2);
    return timestamp;
  }
  makeQtyValid() {
    if (this.AutoQty > 0) {
      this.qtyValid = true;
    } else {
      this.qtyValid = false;
    }
  }
  resetForm(silent = false) {
    if (!silent) {
      if (!confirm('This will clear all records, do you want to proceed?')) {
        return;
      }
    }
    this.goodsReceiptMaster = new GoodsReceiptMaster();
    this.goodsReceiptDetail = new GoodsReceiptDetail();
    this.goodsReceiptDetails = [];
    this.postProd = new PostToSAP();
    this.AutoBatch = '';
    this.AutoQty = null;
    this.qtyValid = false;
    this.formValid = false;
    this.isPostable = false;
    this.OpenQty = 0;
    this.print = false;
    this.saveBtn = '';
    this.goodsReceiptMaster.TotalQty = 0;
    this.PostedQty = 0;
    this.ProducedQty = 0;
    this.currentDate = Date.now();
    this.prodDate = this.calendar.getToday();
    this.goodsReceiptMaster.CreatedBy = this.userName;
    this.getSupervisors();
  }
  onSubmit(form?: NgForm) {
    if (!confirm('Are you sure you want to save?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.goodsReceiptMaster.DocNum == null || this.goodsReceiptMaster.DocNum.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.goodsReceiptMaster.ProdDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (this.goodsReceiptMaster.GoodsReceiptMasterID !== 0) {
      this.toastr.warning('Record already posted', 'Validation Error!');
      return;
    }
    this.saveBtn = 'disabled';
    this.auth.loading = true;
    this.goodsReceiptMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
    // console.log(this.goodsReceiptMaster.ProdDate);
    const dt = {
      goodsReceiptMaster: this.goodsReceiptMaster,
      goodsReceiptDetails: this.goodsReceiptDetails
    };
    this.handleAPI.create(dt, 'api/PostGoodsReceipt')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Goods Receipt created!', 'Success');
          // console.log(data);
          this.print = true;
          // this.isPostable = true;
          this.goodsReceiptMaster.GoodsReceiptMasterID = data.ID;
          this.formValid = false;
          this.saveBtn = '';
        } else {
          this.toastr.warning(data.Response);
        }
          this.auth.loading = false;
        },
        error => {
          if (typeof error === 'string') {
            this.toastr.warning(error, 'Oops! An error occurred');
          } else {
            this.toastr.warning('Please check the console.', 'Oops! An error occurred');
          }
          this.saveBtn = '';
          this.auth.loading = false;
        }
      );
  }
  postToSAP() {
    if (!confirm('Are you sure you want to post to SAP?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postProd.sapUserName == null || this.goodsReceiptMaster.DocNum.trim() == '') {
      this.toastr.warning('SAP Username is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postProd.sapUserName == null || this.goodsReceiptMaster.DocNum.trim() == '') {
      this.toastr.warning('SAP Password is required.', 'Validation Error!');
      return;
    }
    this.auth.loading = true;
    this.isPostable = false;
    const tmp = 'saplogin';
    this.modalService.dismissAll();
    this.postProd.ObjectID = this.goodsReceiptMaster.GoodsReceiptMasterID;
    this.handleAPI.create(this.postProd, 'api/PostGoodsReceiptToSAP')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Goods Receipt posted to SAP successfully!', 'Success');
          console.log(data);
          this.isPostable = false;
          this.goodsReceiptMaster.IsPosted = true;
          this.auth.loading = false;
        } else {
          this.toastr.warning(data.Response, 'Warning');
          console.log(data);
          this.auth.loading = false;
          this.isPostable = true;
        }
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
  approvePR() {
    if (!confirm('Are you sure you want to approve this document?')) {
      return;
    }
    this.auth.loading = true;
    this.isPostable = false;
    const id = this.goodsReceiptMaster.GoodsReceiptMasterID;
    this.handleAPI.create(this.userName, 'api/ApproveGoodsReceipt/' + id)
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Document approved successfully!', 'Success');
          console.log(data);
          this.isPostable = true;
          this.goodsReceiptMaster.IsApproved = true;
          this.auth.loading = false;
        } else {
          this.toastr.warning(data.Response, 'Warning');
          console.log(data);
          this.auth.loading = false;
        }
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

