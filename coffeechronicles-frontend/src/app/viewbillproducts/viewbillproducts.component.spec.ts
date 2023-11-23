import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbillproductsComponent } from './viewbillproducts.component';

describe('ViewbillproductsComponent', () => {
  let component: ViewbillproductsComponent;
  let fixture: ComponentFixture<ViewbillproductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewbillproductsComponent]
    });
    fixture = TestBed.createComponent(ViewbillproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
