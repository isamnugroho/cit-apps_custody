import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownModalPage } from './countdown-modal.page';

describe('CountdownModalPage', () => {
  let component: CountdownModalPage;
  let fixture: ComponentFixture<CountdownModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CountdownModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
