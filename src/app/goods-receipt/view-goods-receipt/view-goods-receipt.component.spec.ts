import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGoodsReceiptComponent } from './view-goods-receipt.component';

describe('ViewGoodsReceiptComponent', () => {
  let component: ViewGoodsReceiptComponent;
  let fixture: ComponentFixture<ViewGoodsReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGoodsReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGoodsReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
