/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialistPage } from './specialist.page';

describe('SpecialistPage', () => {
  let component: SpecialistPage;
  let fixture: ComponentFixture<SpecialistPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpecialistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
