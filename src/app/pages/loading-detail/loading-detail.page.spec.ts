import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingDetailPage } from './loading-detail.page';

describe('LoadingDetailPage', () => {
  let component: LoadingDetailPage;
  let fixture: ComponentFixture<LoadingDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoadingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
