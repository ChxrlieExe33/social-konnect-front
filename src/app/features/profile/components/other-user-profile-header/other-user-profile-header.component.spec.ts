import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserProfileHeaderComponent } from './other-user-profile-header.component';

describe('OtherUserProfileHeaderComponent', () => {
  let component: OtherUserProfileHeaderComponent;
  let fixture: ComponentFixture<OtherUserProfileHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherUserProfileHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherUserProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
