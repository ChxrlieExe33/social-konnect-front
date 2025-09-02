import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWhoLikedComponent } from './users-who-liked.component';

describe('UsersWhoLikedComponent', () => {
  let component: UsersWhoLikedComponent;
  let fixture: ComponentFixture<UsersWhoLikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersWhoLikedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersWhoLikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
