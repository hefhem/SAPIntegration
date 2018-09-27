import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProdSummaryComponent } from './view-prod-summary.component';

describe('ViewProdSummaryComponent', () => {
  let component: ViewProdSummaryComponent;
  let fixture: ComponentFixture<ViewProdSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProdSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProdSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
