import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DataTablesModule } from 'angular-datatables';
import { NgxBarcodeModule } from 'ngx-barcode';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ViewUsersComponent } from './User/view-users/view-users.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from './shared/services/api.service';
import { AuthService } from './shared/services/auth.service';
import { HandleErrorService } from './shared/services/handle-error.service';
import { UtilService } from './shared/services/util.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { HttpClientModule } from '@angular/common/http';
import { HandleAPIService } from './shared/services/handle-api.service';
import { ReceiptProdComponent } from './receipt-prod/receipt-prod.component';
import { ViewReceiptProdComponent } from './receipt-prod/view-receipt-prod/view-receipt-prod.component';
import { ArDeliveryComponent } from './ar-delivery/ar-delivery.component';
import { PrintArDeliveryComponent } from './ar-delivery/print-ar-delivery/print-ar-delivery.component';
import { ViewArDeliveryComponent } from './ar-delivery/view-ar-delivery/view-ar-delivery.component';
import { ViewProdSummaryComponent } from './receipt-prod/view-prod-summary/view-prod-summary.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { ViewGoodsReceiptComponent } from './goods-receipt/view-goods-receipt/view-goods-receipt.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ViewUsersComponent,
    LoginComponent,
    ReceiptProdComponent,
    ViewReceiptProdComponent,
    ArDeliveryComponent,
    PrintArDeliveryComponent,
    ViewArDeliveryComponent,
    ViewProdSummaryComponent,
    GoodsReceiptComponent,
    ViewGoodsReceiptComponent
  ],
  imports: [
    BrowserModule,
    NgxBarcodeModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DataTablesModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot(),
    StorageServiceModule
  ],
  providers: [
    ApiService,
    AuthService,
    HandleErrorService,
    UtilService,
    HandleAPIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
