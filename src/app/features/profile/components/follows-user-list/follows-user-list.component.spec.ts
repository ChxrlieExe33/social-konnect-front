import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsUserListComponent } from './follows-user-list.component';

describe('FollowsUserListComponent', () => {
  let component: FollowsUserListComponent;
  let fixture: ComponentFixture<FollowsUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowsUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowsUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
