import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input } from '@angular/core';
import { ProdMaster, ProdDetail, PostToSAP, ProductionOrderModel } from '../shared/models/production';
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
  @ViewChild('newSticker') labelRef: ElementRef;
  prodMaster: ProdMaster = new ProdMaster();
  prodDetail: ProdDetail = new ProdDetail();
  prodDetails: ProdDetail[] = [];
  postProd: PostToSAP = new PostToSAP();
  prodOrderModel: ProductionOrderModel = new ProductionOrderModel();
  AutoBatch = '';
  AutoQty = null;
  KgQty = null;
  IsKg = true;
  AutoIsRedressed = 'N';
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
  margin = 1;
  marginTop = 10;
  marginBottom = 1;
  marginLeft = 10;
  marginRight = 10;

  closeResult: string;
  bc_weight: number;
  bc_batchno: string;
  currentDate: number;
  cDate: Date;
  prodDate;
  postDate;
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
  lastValue = 0;
  postLoading = 'Post';
  @Input() cssSelector: string;
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.supervisors
        : this.supervisors.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
  constructor(
    private modalService: NgbModal,
    private handleAPI: HandleAPIService,
    private toastr: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar,
    private renderer: Renderer2
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
      this.getCurrentDate();
    } else {
      this.getCurrentDate();
      this.prodMaster.TotalQty = 0;
      this.currentDate = Date.now();
      this.prodDate = this.calendar.getToday();
      //this.prodDate = this.calendar.getPrev(this.prodDate,'d',1);
      // this.prodDate = this.cDate;
      this.prodMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
      // this.prodMaster.ProdDate = this.cDate;
      // console.log(this.prodMaster.ProdDate);
      // console.log(this.prodDate);
      this.getSupervisors();
      this.prodMaster.CreatedBy = this.userName;
    }
    // console.log(this.auth.userRole);
  }
  changeShift(event){
    //console.log(event.target.value);
    if (event.target.value == 'Night'){
      this.prodDate = this.calendar.getPrev(this.prodDate,'d',1);
    } else if (event.target.value == 'Day'){
      this.prodDate = this.calendar.getToday();
    }
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
            this.lastValue = this.prodDetails[this.prodDetails.length-1].Quantity;
            // tslint:disable-next-line:triple-equals
            if (this.prodMaster.UOM.toLowerCase() == 'kg' || this.prodMaster.UOM.toLowerCase() == 'kgs' ) {
              this.IsKg = true;
            } else {
              this.IsKg = false;
              if (data.prodMaster.AutoConvert == 'N'){
                this.AutoQty = data.prodMaster.QtyInUOM;
              }
            }
            this.getProducedQty();
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
          // tslint:disable-next-line:triple-equals
          if ( data.ItemCode == null) {
            this.toastr.warning('No record found!');
          } else {
            this.prodMaster.CardName = data.CardName;
            this.prodMaster.ItemCode = data.ItemCode;
            this.prodMaster.DocEntry = data.DocEntry;
            this.prodMaster.ItemName = data.ItemName;
            this.prodMaster.PlannedQty = data.PlannedQty;
            this.prodMaster.CompletedQty = data.CompltQty;
            this.prodMaster.MachineNo = data.MachineNo;
            this.prodMaster.KgFactor = data.KgFactor;
            this.prodMaster.UOM = data.UOM;
            this.prodDetails = [];
            this.AutoQty = null;
            this.KgQty = null;
            this.prodMaster.AutoConvert = data.AutoConvert;
            this.prodMaster.QtyInUOM = data.QtyInUOM;
            // tslint:disable-next-line:triple-equals
            if (data.UOM.toLowerCase() == 'kg' || data.UOM.toLowerCase() == 'kgs' ) {
              this.IsKg = true;
            } else {
              this.IsKg = false;
              if (data.AutoConvert == 'N'){
                this.AutoQty = this.prodMaster.QtyInUOM;
              }
            }
            // tslint:disable-next-line:max-line-length
            this.OpenQty = (this.prodMaster.PlannedQty - this.prodMaster.CompletedQty) < 0 ? 0 : (this.prodMaster.PlannedQty - this.prodMaster.CompletedQty);
            this.getSupervisors();
            this.getProducedQty();
          }
            // this.BalanceQty = this.prodMaster.PlannedQty - this.ProducedQty;
            this.auth.loading = false;
            this.spincls = '';
          },
          error => {
            this.toastr.warning(error, 'Oops! An error occurred');
            this.auth.loading = false;
            this.spincls = '';
          }
      );
    } else {
      this.auth.loading = false;
      this.spincls = '';
    }
  }
  getCurrentDate() {
    // tslint:disable-next-line:triple-equals
      this.handleAPI.get('api/GetCurrentDate')
        .subscribe( (data: any) => {
          this.cDate = data;
          },
          error => {
            console.log(error);
          }
      );
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
    this.prodMaster.ProdDate = new Date(Date.UTC(this.prodDate.year, this.prodDate.month - 1, this.prodDate.day, 0, 0, 0, 0));
    // console.log(this.prodMaster.ProdDate);
  }
  onAddBatch() {
    if (!(this.prodMaster.ProdMasterID > 0)) {
      this.setDate();
    }
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum == null || this.prodMaster.DocNum.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.Supervisor == null || this.prodMaster.Supervisor.trim() == '') {
      this.toastr.warning('Supervisor is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.Shift == null || this.prodMaster.Shift.trim() == '') {
      this.toastr.warning('Shift is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.Warehouse == null || this.prodMaster.Warehouse.trim() == '') {
      this.toastr.warning('Warehouse is required.', 'Validation Error!');
      return;
    }
    if (this.prodMaster.ProdDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (!(this.AutoQty > 0)) {
      this.toastr.warning('Quantity must be greater than zero(0)');
      return;
    }
    if (!(this.KgQty > 0)) {
      this.toastr.warning('Kg Qty must be greater than zero(0)');
      return;
    }
    const tt = (((this.AutoQty + this.ProducedQty)/this.prodMaster.PlannedQty) * 100) - 100
    if (tt > 5) {
      const ntt = tt.toFixed(2);
      if (!confirm(`Produced quantity is about to exceed planned quantity by ${ntt}%. \n Do you want to proceed?`)){
        return;
      }
    }

    if (this.lastValue != 0){
      const diff = this.AutoQty - this.lastValue;
      const perc = (diff/this.AutoQty) * 100;
      //console.log(perc);
      const nperc = perc.toFixed(2);
      if (perc >= 1 || perc <= -1){
        if (!confirm(`The difference between this batch and last batch quantity is ${nperc}%. Do you want to continue?`)){
          return;
        }
      }
    }
    console.log(this.lastValue);
    this.auth.loading = true;

    let batch = this.generateBatchNo();
    while (this.batchExist(batch)) {
      batch = this.generateBatchNo();
    }
    
    this.prodDetail.BatchNo = batch;
    this.prodDetail.Quantity = this.AutoQty;
    this.prodDetail.KgQty = this.KgQty;
    this.prodDetail.IsRedressed = this.AutoIsRedressed;
    this.prodMaster.NoOfRolls = this.prodMaster.NoOfRolls + 1;
    // this.prodDetail.Line_No = this.lineCount + 1;
    const dt = {
      prodMaster: this.prodMaster,
      prodDetail: this.prodDetail
    };
    this.handleAPI.create(dt, 'api/AddBatchToList')
        .subscribe( (data: any) => {
          // console.log(data);
          const oldid = this.prodMaster.ProdMasterID;
          if (data.IsSuccess) {
            if (!(this.prodMaster.ProdMasterID > 0)) {
              this.prodMaster.ProdMasterID = data.ID;
              this.prodMaster.PackingNo = data.PackingNo;
            }
            this.getProducedQty();
            this.lastValue = this.AutoQty;
            this.prodDetail.ProdDetailID = data.prodDetailID;
            this.prodMaster.TotalQty = this.prodMaster.TotalQty + this.AutoQty;
            this.prodDetails.unshift(this.prodDetail);
            this.open(this.labelRef, this.prodDetail);
            this.prodDetail = new ProdDetail();
            this.AutoBatch = '';
            if (this.prodMaster.AutoConvert == 'N'){
              this.AutoQty = this.prodMaster.QtyInUOM;
            } else {
              this.AutoQty = null;
            }
            this.KgQty = null;
            this.AutoIsRedressed = 'N';
            this.qtyValid = false;
            this.print = true;
            // s etTimeout(() => { this.renderer.selectRootElement(this.cssSelector).focus(); }, 100);
            // this.setDate();
            if (!(oldid > 0)) {
              this.router.navigate(['/receipt-prod/' + data.ID]);
              // setTimeout(() => { this.renderer.selectRootElement(this.cssSelector).focus(); }, 100);
            }
          } else {
            this.toastr.error(data.Response, 'Error!');
          }
          this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
    // tslint:disable-next-line:triple-equals
    if (this.prodMaster.DocNum.trim() != '' && this.prodMaster.ProdDate != null && this.prodMaster.Supervisor.trim() != '') {
      this.formValid = true;
    }
  }
  batchExist(batch: string) {
    const bc = this.prodDetails.filter(x => x.BatchNo == batch);
    if (bc.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  cancelRecord() {
    if (!confirm('Are you sure you want to cancel this record?')) {
      return;
    }
    if (this.prodMaster.ProdMasterID > 0) {
      this.handleAPI.create('', 'api/CancelProductionOrder/' + this.prodMaster.ProdMasterID )
          .subscribe( (data: any) => {
            // console.log(data);
            if (data.IsSuccess) {
              this.toastr.success(data.Response);
              this.resetForm(true);
              this.router.navigate(['/receipt-prod']);
              // this.setDate();
            } else {
              this.toastr.error(data.Response, 'Error!');
            }
            this.auth.loading = false;
          },
          error => {
            this.toastr.warning(error, 'Oops! An error occurred');
            this.auth.loading = false;
          }
        );
    }
  }
  openRecord() {
    if (!confirm('Are you sure you want to open this record?')) {
      return;
    }
    if (this.prodMaster.ProdMasterID > 0) {
      this.handleAPI.create('', 'api/OpenProductionOrder/' + this.prodMaster.ProdMasterID )
          .subscribe( (data: any) => {
            // console.log(data);
            if (data.IsSuccess) {
              this.toastr.success(data.Response);
              this.prodMaster.Status = 'O';
              // this.setDate();
            } else {
              this.toastr.error(data.Response, 'Error!');
            }
            this.auth.loading = false;
          },
          error => {
            this.toastr.warning(error, 'Oops! An error occurred');
            this.auth.loading = false;
          }
        );
    }
  }
  setKgQty() {
    this.KgQty = this.AutoQty / this.prodMaster.KgFactor;
  }
  setUOMQty() {
    if (this.IsKg) {
      this.AutoQty = this.KgQty * this.prodMaster.KgFactor;
    } else {
      if (this.prodMaster.AutoConvert == 'Y'){
        this.AutoQty = (this.KgQty * this.prodMaster.KgFactor).toFixed(2);
      }
    }
    // if (this.prodMaster.KgFactor === 1) {
    //   this.AutoQty = Math.round(this.KgQty * this.prodMaster.KgFactor);
    // } else {
    //   this.AutoQty = this.KgQty * this.prodMaster.KgFactor;
    // }
  }
  onRemoveBatch(item: ProdDetail) {
    if (!confirm('Are you sure you want to remove this Batch?')) {
      return;
    }
    this.auth.loading = true;
    if (this.prodMaster.ProdMasterID > 0) {
      this.prodMaster.NoOfRolls = this.prodMaster.NoOfRolls - 1;
        this.handleAPI.create('', 'api/RemoveBatchFromList/' + item.ProdDetailID)
        .subscribe( (data: any) => {
          // console.log(data);
          if (data.IsSuccess) {
            this.toastr.success('Item removed successfully');
            this.rmBatch(item);
            this.getProducedQty();
            this.lastValue = this.prodDetails[this.prodDetails.length-1].Quantity;
          } else {
            this.toastr.error(data.Response, 'Error!');
          }
          this.auth.loading = false;
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
    }
  }
  rmBatch(item: ProdDetail) {
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
  openOldLabel(content, idt: ProdDetail) {
    this.setLabelValue(idt, this.printRecord);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    setTimeout(() => { this.printRecord2('print-section'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
    // this.modalService.dismissAll();
  }
  openMiniLabel(content, idt: ProdDetail) {
    this.setMiniLabelValue(idt, this.printRecord);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'});
    setTimeout(() => { this.printMiniLabel('print-section'); }, 300);
    setTimeout(() => { this.modalService.dismissAll(); }, 1000);
    // this.modalService.dismissAll();
  }
  setLabelValue(idt: ProdDetail, callback) {
    this.lbl = true;
    this.value = idt.BatchNo;
    this.bc_batchno = this.value;
    this.bc_weight = idt.Quantity;
    this.expiry = new Date(this.prodMaster.ProdDate);
    // console.log(this.prodMaster.ProdDate);
    this.expiry.setDate(this.expiry.getDate() + 365);
  }
  setMiniLabelValue(idt: ProdDetail, callback) {
    this.lbl = true;
    this.value = idt.BatchNo;
    this.bc_batchno = this.value;
  }
  openModalPost(content, sz: any = 'lg') {
    this.postProd.sapUserName = this.auth.getUserName();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }
  openModal(content, sz: any = 'lg') {
    this.prodMaster.TotalQty = 0;
    this.prodDetails.forEach(x => {
      this.prodMaster.TotalQty += x.Quantity;
    });
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
            width:100%;
            font-size:40pt;
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
  printRecord2(elem: any): void {
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
  printMiniLabel(elem: any): void {
    let printContents, popupWin;
    printContents = document.getElementById(elem).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
          <link rel="stylesheet" href="../assets/css/fontawesome-all.css">
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
        <body onload="window.print();">
        ${printContents}
        </div>
        </div>
        </body>
      </html>`
    );
    //<body onload="window.print();window.close()">
    popupWin.document.close();
  }
  generateBatchNo() {
    let timestamp = '';
    const now = new Date();

    timestamp = now.getFullYear().toString().substr(2, 2); // 2011
    timestamp += (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1).toString(); // JS months are 0-based, so +1 and pad with 0's
    timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0
    timestamp += this.prodMaster.MachineNo.substr(0, 2); // pad with a 0
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
    this.prodMaster = new ProdMaster();
    this.prodDetail = new ProdDetail();
    this.prodDetails = [];
    this.postProd = new PostToSAP();
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
    this.lastValue = 0;
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
    this.prodMaster.NoOfRolls = this.prodDetails.length;
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
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
  }
  postToSAP() {
    if (!confirm('Are you sure you want to post to SAP?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postProd.sapUserName == null || this.postProd.sapUserName.trim() == '') {
      this.toastr.warning('SAP Username is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postProd.sapPassword == null || this.postProd.sapPassword.trim() == '') {
      this.toastr.warning('SAP Password is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postDate == null) {
      this.toastr.warning('Posting date is required.', 'Validation Error!');
      return;
    }
    this.auth.loading = true;
    this.postLoading = 'Executing...';
    this.postProd.postDate = new Date(Date.UTC(this.postDate.year, this.postDate.month - 1, this.postDate.day, 0, 0, 0, 0));
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
          if (data.ID == -2){
            this.prodMaster.IsPosted = true;
            this.isPostable = false;
          }
        }
        this.postLoading = 'Post';
        },
        error => {
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
          this.postLoading = 'Post';
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
    this.handleAPI.create(this.userName, 'api/ApprovePR/' + id)
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
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
      );
  }
}
