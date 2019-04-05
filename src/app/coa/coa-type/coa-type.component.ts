import { Component, OnInit } from '@angular/core';
import { HandleAPIService } from '../../shared/services/handle-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Subject } from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/map';
import { GoodsReceiptMaster } from '../../shared/models/production';
import { COAType } from 'src/app/shared/models/coa';

@Component({
  selector: 'app-coa-type',
  templateUrl: './coa-type.component.html',
  styleUrls: ['./coa-type.component.css']
})
export class COATypeComponent implements OnInit {

  dtOptions: any = {};
  endpoint = 'api/GetCOAType';
  coaTypeList: COAType[] = [];
  coatype = new COAType();
  userID: any;
  recordStatus = 'Save';
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private modalService: NgbModal,
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
    this.getCOAType();
  }

  getCOAType() {
    this.auth.loading = true;
    this.coaTypeList = [];
    this.handleAPI.get(this.endpoint)
      .subscribe( (data: any) => {
          console.log(data);
          this.coaTypeList = data;
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
          this.toastr.warning(error, 'Oops! An error occurred');
          this.auth.loading = false;
        }
    );
  }
  openModal(content, dt = new COAType()) {
    this.coatype.COATypeID = dt.COATypeID;
    this.coatype.COATypeName = dt.COATypeName;
    if (this.coatype.COATypeID > 0){
      this.recordStatus = 'Update';
    } else {
      this.recordStatus = 'Save';
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static', size: 'sm'});
  }
  addEditRecord(){
    if(!confirm('Are you sure want to save this record?')){
      return;
    }
    const dt = this.coatype;
    if (dt.COATypeName.trim() == '') {
      return this.toastr.warning('COA Type Name is required', 'Validation error');
    }

    if (dt.COATypeID == 0) {
        this.handleAPI.create(dt, 'api/AddCOAType')
          .subscribe( (data: any) => {
            if (data.IsSuccess) {
              this.toastr.success('Record added successfully!', 'Notice');
              this.getCOAType();
              this.coatype = new COAType();
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
    } else {
      this.handleAPI.create(dt, 'api/EditCOAType')
          .subscribe( (data: any) => {
            if (data.IsSuccess) {
              this.toastr.success('Record updated successfully!', 'Notice');
              this.getCOAType();
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
  }

  ondelete(dt: COAType){
    if (!confirm('Are you sure you want to delete this record?')){
      return;
    }
    const obj = {
      Username: this.auth.getUserID(),
      ObjectID: dt.COATypeID
    };
    this.handleAPI.create(obj, 'api/DeleteCOAType')
    .subscribe( (data: any) => {
      if (data.IsSuccess) {
        this.toastr.success('Record deleted successfully!', 'Notice');
        this.getCOAType();
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
}

