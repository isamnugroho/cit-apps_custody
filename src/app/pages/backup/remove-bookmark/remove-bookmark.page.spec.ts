/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Salon Locks & Lashes This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveBookmarkPage } from './remove-bookmark.page';

describe('RemoveBookmarkPage', () => {
  let component: RemoveBookmarkPage;
  let fixture: ComponentFixture<RemoveBookmarkPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RemoveBookmarkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
