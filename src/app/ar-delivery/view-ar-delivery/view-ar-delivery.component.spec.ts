import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewArDeliveryComponent } from './view-ar-delivery.component';

describe('ViewArDeliveryComponent', () => {
  let component: ViewArDeliveryComponent;
  let fixture: ComponentFixture<ViewArDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewArDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
