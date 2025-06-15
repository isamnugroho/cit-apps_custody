import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobReviewCosPage } from './job-review-cos.page';

describe('JobReviewCosPage', () => {
  let component: JobReviewCosPage;
  let fixture: ComponentFixture<JobReviewCosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobReviewCosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
