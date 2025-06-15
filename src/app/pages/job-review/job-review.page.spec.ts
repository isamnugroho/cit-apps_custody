import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobReviewPage } from './job-review.page';

describe('JobReviewPage', () => {
  let component: JobReviewPage;
  let fixture: ComponentFixture<JobReviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
