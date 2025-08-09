import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostFullscreenComponent } from './post-fullscreen.component';

describe('PostFullscreenComponent', () => {
  let component: PostFullscreenComponent;
  let fixture: ComponentFixture<PostFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFullscreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
