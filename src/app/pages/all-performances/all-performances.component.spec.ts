import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPerformancesComponent } from './all-performances.component';

describe('AllPerformancesComponent', () => {
  let component: AllPerformancesComponent;
  let fixture: ComponentFixture<AllPerformancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllPerformancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPerformancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
