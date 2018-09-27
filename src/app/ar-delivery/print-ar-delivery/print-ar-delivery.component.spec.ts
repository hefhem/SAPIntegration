import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintArDeliveryComponent } from './print-ar-delivery.component';

describe('PrintArDeliveryComponent', () => {
  let component: PrintArDeliveryComponent;
  let fixture: ComponentFixture<PrintArDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintArDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintArDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
