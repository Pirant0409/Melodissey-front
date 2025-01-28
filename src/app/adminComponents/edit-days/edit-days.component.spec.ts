import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDaysComponent } from './edit-days.component';

describe('EditDaysComponent', () => {
  let component: EditDaysComponent;
  let fixture: ComponentFixture<EditDaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
