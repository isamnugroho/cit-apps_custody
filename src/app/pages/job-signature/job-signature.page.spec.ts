import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobSignaturePage } from './job-signature.page';

describe('JobSignaturePage', () => {
  let component: JobSignaturePage;
  let fixture: ComponentFixture<JobSignaturePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JobSignaturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
