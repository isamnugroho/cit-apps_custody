import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewModalPage } from './review-modal.page';

describe('ReviewModalPage', () => {
  let component: ReviewModalPage;
  let fixture: ComponentFixture<ReviewModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReviewModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
