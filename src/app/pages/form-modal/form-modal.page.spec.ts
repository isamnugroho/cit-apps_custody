import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormModalPage } from './form-modal.page';

describe('FormModalPage', () => {
  let component: FormModalPage;
  let fixture: ComponentFixture<FormModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
