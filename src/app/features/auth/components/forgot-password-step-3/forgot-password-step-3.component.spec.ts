import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordStep3Component } from './forgot-password-step-3.component';

describe('ForgotPasswordStep3Component', () => {
  let component: ForgotPasswordStep3Component;
  let fixture: ComponentFixture<ForgotPasswordStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordStep3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
