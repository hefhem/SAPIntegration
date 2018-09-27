import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceiptProdComponent } from './view-receipt-prod.component';

describe('ViewReceiptProdComponent', () => {
  let component: ViewReceiptProdComponent;
  let fixture: ComponentFixture<ViewReceiptProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReceiptProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReceiptProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
