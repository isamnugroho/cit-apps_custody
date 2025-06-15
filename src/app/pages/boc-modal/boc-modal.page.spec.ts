/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : CIT Apps This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BocModalPage } from './boc-modal.page';

describe('BocModalPage', () => {
  let component: BocModalPage;
  let fixture: ComponentFixture<BocModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BocModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
