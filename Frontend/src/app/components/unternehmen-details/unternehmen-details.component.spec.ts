import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnternehmenDetailsComponent } from './unternehmen-details.component';

describe('UnternehmenDetailsComponent', () => {
  let component: UnternehmenDetailsComponent;
  let fixture: ComponentFixture<UnternehmenDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnternehmenDetailsComponent]
    });
    fixture = TestBed.createComponent(UnternehmenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
