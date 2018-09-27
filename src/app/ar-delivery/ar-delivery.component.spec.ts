import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArDeliveryComponent } from './ar-delivery.component';

describe('ArDeliveryComponent', () => {
  let component: ArDeliveryComponent;
  let fixture: ComponentFixture<ArDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
