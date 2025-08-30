import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFollowingComponent } from './my-following.component';

describe('MyFollowingComponent', () => {
  let component: MyFollowingComponent;
  let fixture: ComponentFixture<MyFollowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyFollowingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
