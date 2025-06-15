import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobFinishPage } from './job-finish.page';

describe('JobFinishPage', () => {
  let component: JobFinishPage;
  let fixture: ComponentFixture<JobFinishPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobFinishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
