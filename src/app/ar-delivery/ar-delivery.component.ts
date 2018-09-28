import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { DeliveryMaster, DeliveryDetail, DeliveryPacking, DeliveryData, PostDelivery, DeliveryDetailsPackings } from '../shared/models/delivery';
import { NgbModal, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { HandleAPIService } from '../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ar-delivery',
  templateUrl: './ar-delivery.component.html',
  styleUrls: ['./ar-delivery.component.css']
})
export class ArDeliveryComponent implements OnInit {
  deliveryMaster = new DeliveryMaster();
  deliveryDetails: DeliveryDetail[] = [];
  deliveryDetail: DeliveryDetail;
  deliveryPacking: DeliveryPacking[] = [];
  objDelivery = new DeliveryData();
  objDDP: DeliveryDetailsPackings[] = [];
  dpb: DeliveryPacking[] = [];
  print = false;
  saveBtn = '';
  docDate: any;
  userName = '';
  isPostable = false;
  postDel: PostDelivery = new PostDelivery();
  scanItem = '';
  scanItemCode = '';
  barcode = '';
  ddid = 0;
  formValid = false;
  spincls = '';
  id = 0;

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
    // console.log(this.id);
    if (this.id > 0) {
      this.getDeliveryMasterDetails(this.id);
    } else {
    this.docDate = this.calendar.getToday();
    this.deliveryMaster.DocDate = new Date(Date.UTC(this.docDate.year, this.docDate.month - 1, this.docDate.day, 0, 0, 0, 0));
    this.deliveryMaster.CreatedBy = this.userName;
  }
  }
  setDate() {
    this.deliveryMaster.DocDate = new Date(this.docDate.year + '-' + this.docDate.month + '-' + this.docDate.day);
  }
  openScan(content, idt: DeliveryDetail) {
    this.scanItem = idt.ItemName;
    this.scanItemCode = idt.ItemNo;
    this.ddid = idt.LineNum;
    const ed = this.deliveryPacking.filter(x => x.DeliveryDetailID === this.ddid);
    if (ed.length > 0) {
      this.dpb = [];
      this.dpb = ed;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'lg'});
    // this.barcodeid.nativeElement.focus();
  }
  openModalPost(content, sz: any = 'lg') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }
  openModal(content, sz: any = 'lg') {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: sz});
  }
  getOrderDetails() {
    // tslint:disable-next-line:triple-equals
    if (this.deliveryMaster.SOrderNo.trim() == '' || this.deliveryMaster.SOrderNo == null) {
      this.resetForm(true);
      return;
    }
    const id = this.deliveryMaster.SOrderNo;
    this.auth.loading = true;
    this.spincls = 'fa-spin';
    // tslint:disable-next-line:triple-equals
    // if (this.prodMaster.DocNum != '') {
      this.handleAPI.get('api/GetSalesOrder/' + id)
        .subscribe( (data: any) => {
          // console.log(JSON.stringify(data));
          if (JSON.stringify(data.deliveryDetail).length > 0) {
            this.deliveryMaster = data.deliveryMaster;
            this.deliveryDetails = data.deliveryDetail;
            this.deliveryMaster.IsApproved = false;
            this.deliveryMaster.IsPosted = false;
            this.deliveryMaster.CreatedBy = this.userName;
          } else {
            this.toastr.warning('No record found for the Order number!');
          }
            this.deliveryDetail = null;
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
  }
  resetForm(silent = false) {
    if (!silent) {
      if (!confirm('This will clear all records, do you want to proceed?')) {
        return;
      }
    }
    this.deliveryMaster = new DeliveryMaster();
    this.deliveryDetail = new DeliveryDetail();
    this.deliveryDetails = [];
    this.postDel = new PostDelivery();
    this.formValid = false;
    this.isPostable = false;
    this.print = false;
    this.saveBtn = '';
    this.docDate = this.calendar.getToday();
    this.deliveryMaster.CreatedBy = this.userName;
  }
  getDeliveryMasterDetails(id: any) {
    // console.log('hello');
    this.auth.loading = true;
    // tslint:disable-next-line:triple-equals
    // if (this.prodMaster.DocNum != '') {
      this.handleAPI.get('api/nGetDeliveryByID/' + id)
        .subscribe( (data: any) => {
            // const dt = JSON.parse(data);
            if (data.deliveryMaster != null) {
              this.deliveryMaster = data.deliveryMaster;
              this.deliveryDetails = data.deliveryDetails;
              this.deliveryPacking = data.deliveryPackings;
              this.auth.loading = false;
              this.print = true;
              this.formValid = false;
              this.isPostable = this.deliveryMaster.IsApproved ? true : false;
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
  }
  submitDelivery(form?: NgForm) {
    if (!confirm('Are you sure you want to save?')) {
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.deliveryMaster.SOrderNo == null || this.deliveryMaster.SOrderNo.trim() == '') {
      this.toastr.warning('Order number is required.', 'Validation Error!');
      return;
    }
    if (this.deliveryMaster.DocDate == null) {
      this.toastr.warning('Date is required.', 'Validation Error!');
      return;
    }
    if (this.deliveryMaster.DeliveryMasterID !== 0) {
      this.toastr.warning('Record already posted', 'Validation Error!');
      return;
    }
    this.saveBtn = 'disabled';
    this.auth.loading = true;
    this.deliveryMaster.DocDate = new Date(Date.UTC(this.docDate.year, this.docDate.month - 1, this.docDate.day, 0, 0, 0, 0));
    // console.log(this.prodMaster.ProdDate);
    const dt = {
      deliveryMaster: this.deliveryMaster,
      deliveryDetails: this.deliveryDetails,
      deliveryPackings: this.deliveryPacking
    };
    this.handleAPI.create(dt, 'api/nPostDelivery')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Delivery created!', 'Success');
          // console.log(data);
          this.print = true;
          // this.isPostable = true;
          this.deliveryMaster.DeliveryMasterID = data.ID;
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
    if (this.postDel.sapUserName == null || this.deliveryMaster.SOrderNo.trim() == '') {
      this.toastr.warning('SAP Username is required.', 'Validation Error!');
      return;
    }
    // tslint:disable-next-line:triple-equals
    if (this.postDel.sapUserName == null || this.deliveryMaster.SOrderNo.trim() == '') {
      this.toastr.warning('SAP Password is required.', 'Validation Error!');
      return;
    }
    this.auth.loading = true;
    this.isPostable = false;
    const tmp = 'saplogin';
    this.modalService.dismissAll();
    this.postDel.ObjectID = this.deliveryMaster.DeliveryMasterID;
    this.handleAPI.create(this.postDel, 'api/nPostDeliveryToSAP')
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Delivery posted to SAP successfully!', 'Success');
          console.log(data);
          this.isPostable = false;
          this.deliveryMaster.IsPosted = true;
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
  approveDelivery() {
    if (!confirm('Are you sure you want to approve this document?')) {
      return;
    }
    this.auth.loading = true;
    this.isPostable = false;
    const id = this.deliveryMaster.DeliveryMasterID;
    this.handleAPI.create(this.userName, 'api/ApproveDelivery/' + id)
      .subscribe( (data: any) => {
        if (data.IsSuccess) {
          this.toastr.success('Document approved successfully!', 'Success');
          // console.log(data);
          this.isPostable = true;
          this.deliveryMaster.IsApproved = true;
          this.auth.loading = false;
        } else {
          this.toastr.warning(data.Response, 'Warning');
          // console.log(data);
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
  onAddBarcode() {
    // tslint:disable-next-line:triple-equals
    const bc = this.dpb.filter(x => x.PackingNo == this.barcode);
    if (bc.length > 0) {
      this.toastr.warning('Item already exists in the list');
      this.barcode = '';
      return;
    }
    this.auth.loading = true;
    this.handleAPI.get('api/GetPackingNoDetails/' + this.barcode)
        .subscribe( (data: any) => {
          // console.log(data);
          if (data.Status === 'Found') {
            if (this.scanItemCode === data.ItemCode  ) {
              const dt = {
                DeliveryPackingID: 0,
                DeliveryDetailID: this.ddid,
                ItemName: this.scanItem,
                PackingNo: this.barcode,
                Quantity: data.TotalQty
              };
              this.dpb.push(dt);
            } else {
              this.toastr.warning('The scanned code does not belong to this Item');
            }
          } else if (data.status === 'Consumed') {
            this.toastr.error('Item with this barcode is already consumed');
          } else {
            this.toastr.error('Item with this barcode not found');
          }
          this.barcode = '';
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
  AddItemToList() {
    if (this.dpb.length > 0) {
     if (confirm('This will add scanned items to the pick list. Do you want to continue?')) {
      let sum = 0;
      this.dpb.forEach((dp) => {
        const ex = this.deliveryPacking.filter(x => x.PackingNo === dp.PackingNo);
        if (!(ex.length > 0)) {
          this.deliveryPacking.push(dp);
        }
        sum = sum + dp.Quantity;
      });
      const dd = this.deliveryDetails.filter( x => x.LineNum === this.ddid)[0];
      const dr = this.deliveryDetails.filter( x => x.LineNum !== this.ddid);
      dd.SelectedQty = sum;
      dr.push(dd);
      this.deliveryDetails = dr;
      this.dpb = [];
      this.ddid = 0;
      this.modalService.dismissAll();
      this.formValid = true;
    }
  }
    this.modalService.dismissAll();
  }
  removeFromBarcodeList(idt: DeliveryPacking) {
    const i = this.dpb.indexOf(idt);
    if (i !== -1) {
      this.dpb.splice(i, 1);
    }
    const j = this.deliveryPacking.indexOf(idt);
    if (j !== -1) {
      this.deliveryPacking.splice(j, 1);
    } else {
      this.formValid = false;
    }
  }
  removeFromPickList(idt: DeliveryPacking) {
    const i = this.deliveryPacking.indexOf(idt);
    if (i !== -1) {
      this.deliveryPacking.splice(i, 1);
      const dp = this.deliveryDetails.filter(x => x.DeliveryDetailID === idt.DeliveryDetailID)[0];
      const de = this.deliveryDetails.filter(p => p.DeliveryDetailID !== idt.DeliveryDetailID);
      dp.SelectedQty = dp.SelectedQty - idt.Quantity;
      de.push(dp);
      this.deliveryDetails = de;
    } else {
      this.formValid = false;
    }
  }
  removeSOLine(idt: DeliveryDetail) {
    const i = this.deliveryDetails.indexOf(idt);
    if (i !== -1) {
      this.deliveryDetails.splice(i, 1);
    } else {
      this.formValid = false;
    }
  }
}
