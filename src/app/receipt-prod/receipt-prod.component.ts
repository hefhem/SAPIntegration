import { Component, OnInit } from '@angular/core';
import { ProdMaster, ProdDetail, PostProductionReceipt, ProductionOrderModel } from '../shared/models/production';
import {NgbModal, ModalDismissReasons, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { HandleAPIService } from '../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserRole } from '../shared/models/user';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-receipt-prod',
  templateUrl: './receipt-prod.component.html',
  styleUrls: ['./receipt-prod.component.css']
})
export class ReceiptProdComponent implements OnInit {
  prodMaster: ProdMaster = new ProdMaster();
  prodDetail: ProdDetail = new ProdDetail();
  prodDetails: ProdDetail[] = [];
  postProd: PostProductionReceipt = new PostProductionReceipt();
  prodOrderModel: ProductionOrderModel = new ProductionOrderModel();
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
  supervisors = [];
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.supervisors.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
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
      this.getProdMasterDetails(this.id);
    } else {
      this.prodMaster.TotalQty = 0;
      this.currentDate = Date.now();
      this.prodDate = this.calendar.getToday();
      this.prodMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
      // console.log(this.prodMaster.ProdDate);
      // console.log(this.prodDate);
      this.getSupervisors();
      this.prodMaster.CreatedBy = this.userName;
    }
    // console.log(this.auth.userRole);
  }
  getProdMasterDetails(id: any) {
    // console.log('hello');
    this.auth.loading = true;
    // tslint:disable-next-line:triple-equals
    // if (this.prodMaster.DocNum != '') {
      this.handleAPI.get('api/GetPR/' + id)
        .subscribe( (data: any) => {
          // console.log(data);
          if (data.prodMaster != null) {
            this.auth.loading = false;
            this.prodMaster = data.prodMaster;
            this.prodDetails = data.prodDetails;
            this.auth.loading = false;
            this.print = true;
            this.formValid = false;
            this.isPostable = this.prodMaster.IsApproved ? true : false;
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
    if (this.prodMaster.DocNum != '') {
      this.handleAPI.get('api/GetSupervisors/')
        .subscribe( (data: any) => {
          // console.log(data);
           this.supervisors = data;
          },
          error => {
           console.log(error);
          }
      );
    }
  }
  getOrderDetails() {
    // console.log('hello');
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum.trim() == '' || this.prodMaster.DocNum == null) {
      this.resetForm(true);
      return;
    }
    this.auth.loading = true;
    this.spincls = 'fa-spin';
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum.trim() != '' || this.prodMaster.DocNum != null) {
      this.handleAPI.get('api/GetSAPPR/' + this.prodMaster.DocNum)
        .subscribe( (data: any) => {
          // console.log(data);
            this.prodMaster.CardName = data.CardName;
            this.prodMaster.ItemCode = data.ItemCode;
            this.prodMaster.DocEntry = data.DocEntry;
            this.prodMaster.ItemName = data.ItemName;
            this.prodMaster.PlannedQty = data.PlannedQty;
            this.prodMaster.CompletedQty = data.CompltQty;
            this.prodMaster.MachineNo = data.MachineNo;
            // tslint:disable-next-line:max-line-length
            this.OpenQty = (this.prodMaster.PlannedQty - this.prodMaster.CompletedQty) < 0 ? 0 : (this.prodMaster.PlannedQty - this.prodMaster.CompletedQty);
            this.getSupervisors();
            this.getProducedQty();
            // this.BalanceQty = this.prodMaster.PlannedQty - this.ProducedQty;
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
    if (this.prodMaster.DocNum != '') {
      this.handleAPI.get('api/GetProducedQty/' + this.prodMaster.DocNum)
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
    this.prodMaster.ProdDate = new Date(this.prodDate.year + '-' + this.prodDate.month + '-' + this.prodDate.day);
    console.log(this.prodMaster.ProdDate);
  }
  onAddBatch() {
    this.setDate();
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum == null || this.prodMaster.DocNum.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.ProdDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    this.prodDetail.BatchNo = this.generateBatchNo();
    this.prodDetail.Quantity = this.AutoQty;
    // this.prodDetail.Line_No = this.lineCount + 1;
    this.prodDetails.push(this.prodDetail);
    this.prodMaster.TotalQty += this.AutoQty;
    this.prodDetail = new ProdDetail();
    this.AutoBatch = '';
    this.AutoQty = null;
    this.qtyValid = false;
    this.setDate();
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum.trim() != '' && this.prodMaster.ProdDate != null && this.prodMaster.Supervisor.trim() != '') {
      this.formValid = true;
    }
  }
  onRemoveBatch(item: ProdDetail) {
    if (!confirm('Are you sure you want to remove this Batch?')) {
      return;
    }
    const i = this.prodDetails.indexOf(item);

    if (i !== -1) {
      this.prodDetails.splice(i, 1);
      this.prodMaster.TotalQty = this.prodMaster.TotalQty - item.Quantity;
    }
    if (this.prodDetails.length < 1) {
      this.formValid = false;
      this.prodMaster.TotalQty = 0;
    }
  }
  open(content, idt: ProdDetail) {
    this.setLabelValue(idt, this.printRecord);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    setTimeout(() => { this.printRecord('print-section'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
    // this.modalService.dismissAll();
  }
  setLabelValue(idt: ProdDetail, callback) {
    this.lbl = true;
    this.value = idt.BatchNo;
    this.bc_batchno = this.value;
    this.bc_weight = idt.Quantity;
  }
  openModalPost(content, sz: any = 'lg') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }
  openModal(content, sz: any = 'lg') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
    setTimeout(() => { this.printPlist('packingList'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
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
  printPlist(elem: any): void {
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
          @media print
          {
              tbody {
                  page-break-inside: avoid;
              }
              thead {
                  display: table-header-group;
                  margin-top: 100px;
              }
          }
          .table {
            width:100%;
            font-size:14pt;
          }
          td {
            text-align:left;
          }
          </style>
        </head>
        <body onload="window.print();window.close()">
        ${printContents}
        </div>
        </div>
        </body>
      </html>`
    );
    popupWin.document.close();
  }
  generateBatchNo() {
    let timestamp = '';
    const now = new Date();

    timestamp = now.getFullYear().toString(); // 2011
    timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0
    timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    timestamp += now.getMilliseconds().toString().substr(1, 2);
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
    this.prodMaster = new ProdMaster();
    this.prodDetail = new ProdDetail();
    this.prodDetails = [];
    this.postProd = new PostProductionReceipt();
    this.prodOrderModel = new ProductionOrderModel();
    this.AutoBatch = '';
    this.AutoQty = null;
    this.qtyValid = false;
    this.formValid = false;
    this.isPostable = false;
    this.OpenQty = 0;
    this.print = false;
    this.saveBtn = '';
    this.prodMaster.TotalQty = 0;
    this.PostedQty = 0;
    this.ProducedQty = 0;
    this.currentDate = Date.now();
    this.prodDate = this.calendar.getToday();
    this.prodMaster.CreatedBy = this.userName;
    this.getSupervisors();
  }
  onSubmit(form?: NgForm) {
    if (!confirm('Are you sure you want to save?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum == null || this.prodMaster.DocNum.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.ProdDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.ProdMasterID !== 0) {
      this.toastr.warning('Record already posted', 'Validation Error!');
      return;
    }
    this.saveBtn = 'disabled';
    this.auth.loading = true;
    this.prodMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
    // console.log(this.prodMaster.ProdDate);
    const dt = {
      ProdMaster: this.prodMaster,
      ProdDetails: this.prodDetails
    };
    this.handleAPI.create(dt, 'api/ProductionReceipt')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Production Receipt created!', 'Success');
          // console.log(data);
          this.print = true;
          // this.isPostable = true;
          this.prodMaster.ProdMasterID = data.ID;
          this.prodMaster.PackingNo = data.PackingNo;
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
    if (this.postProd.sapUserName == null || this.prodMaster.DocNum.trim() == '') {
      this.toastr.warning('SAP Username is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postProd.sapUserName == null || this.prodMaster.DocNum.trim() == '') {
      this.toastr.warning('SAP Password is required.', 'Validation Error!');
      return;
    }
    this.auth.loading = true;
    this.isPostable = false;
    const tmp = 'saplogin';
    this.modalService.dismissAll();
    this.postProd.ObjectID = this.prodMaster.ProdMasterID;
    this.handleAPI.create(this.postProd, 'api/PostProductionOrder')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Production posted to SAP successfully!', 'Success');
          console.log(data);
          this.isPostable = false;
          this.prodMaster.IsPosted = true;
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
    const id = this.prodMaster.ProdMasterID;
    this.handleAPI.create(this.userID, 'api/ApprovePR/' + id)
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Document approved successfully!', 'Success');
          console.log(data);
          this.isPostable = true;
          this.prodMaster.IsApproved = true;
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
