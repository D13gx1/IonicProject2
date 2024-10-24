import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiInfoPage } from './mi-info.page';

describe('MiInfoPage', () => {
  let component: MiInfoPage;
  let fixture: ComponentFixture<MiInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
