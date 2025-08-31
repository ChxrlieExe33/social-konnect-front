import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMyAccountComponent } from './delete-my-account.component';

describe('DeleteMyAccountComponent', () => {
  let component: DeleteMyAccountComponent;
  let fixture: ComponentFixture<DeleteMyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMyAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
