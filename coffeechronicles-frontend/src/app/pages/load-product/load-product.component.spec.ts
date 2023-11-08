import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadProductComponent } from './load-product.component';

describe('LoadProductComponent', () => {
  let component: LoadProductComponent;
  let fixture: ComponentFixture<LoadProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadProductComponent]
    });
    fixture = TestBed.createComponent(LoadProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
