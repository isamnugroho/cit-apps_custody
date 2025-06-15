import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingDetailBbcPage } from './loading-detail-bbc.page';

describe('LoadingDetailBbcPage', () => {
  let component: LoadingDetailBbcPage;
  let fixture: ComponentFixture<LoadingDetailBbcPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoadingDetailBbcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
