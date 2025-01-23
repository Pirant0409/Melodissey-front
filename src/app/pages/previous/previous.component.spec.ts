import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousComponent } from './previous.component';

describe('PreviousComponent', () => {
  let component: PreviousComponent;
  let fixture: ComponentFixture<PreviousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviousComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
