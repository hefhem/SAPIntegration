import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptProdComponent } from './receipt-prod.component';

describe('ReceiptProdComponent', () => {
  let component: ReceiptProdComponent;
  let fixture: ComponentFixture<ReceiptProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
