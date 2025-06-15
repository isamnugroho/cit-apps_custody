import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobReviewSupervisorPage } from './job-review-supervisor.page';

describe('JobReviewSupervisorPage', () => {
  let component: JobReviewSupervisorPage;
  let fixture: ComponentFixture<JobReviewSupervisorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobReviewSupervisorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
