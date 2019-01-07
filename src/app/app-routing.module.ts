import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ViewUsersComponent } from './User/view-users/view-users.component';
import { LoginComponent } from './login/login.component';
import { ReceiptProdComponent } from './receipt-prod/receipt-prod.component';
import { ViewReceiptProdComponent } from './receipt-prod/view-receipt-prod/view-receipt-prod.component';
import { ViewReceiptProdPostedComponent } from './receipt-prod/view-receipt-prod-posted/view-receipt-prod-posted.component';
import { ArDeliveryComponent } from './ar-delivery/ar-delivery.component';
import { PrintArDeliveryComponent } from './ar-delivery/print-ar-delivery/print-ar-delivery.component';
import { ViewArDeliveryComponent } from './ar-delivery/view-ar-delivery/view-ar-delivery.component';
import { ViewProdSummaryComponent } from './receipt-prod/view-prod-summary/view-prod-summary.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { ViewGoodsReceiptComponent } from './goods-receipt/view-goods-receipt/view-goods-receipt.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'receipt-prod',
    component: ReceiptProdComponent
  },
  {
    path: 'receipt-prod/:id',
    component: ReceiptProdComponent
  },
  {
    path: 'view-receipt-prod',
    component: ViewReceiptProdComponent
  },
  {
    path: 'view-receipt-prod-posted',
    component: ViewReceiptProdPostedComponent
  },
  {
    path: 'goods-receipt',
    component: GoodsReceiptComponent
  }
  ,
  {
    path: 'goods-receipt/:id',
    component: GoodsReceiptComponent
  },
  {
    path: 'view-goods-receipt',
    component: ViewGoodsReceiptComponent
  },
  {
    path: 'view-prod-summary',
    component: ViewProdSummaryComponent
  },
  {
    path: 'ar-delivery',
    component: ArDeliveryComponent
  },
  {
    path: 'ar-delivery/:id',
    component: ArDeliveryComponent
  },
  {
    path: 'view-ar-delivery',
    component: ViewArDeliveryComponent
  },
  {
    path: 'print-ar-delivery',
    component: PrintArDeliveryComponent
  },
  {
    path: 'view-users',
    component: ViewUsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
