import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnternehmenListComponent } from './unternehmen-list.component';

describe('UnternehmenListComponent', () => {
  let component: UnternehmenListComponent;
  let fixture: ComponentFixture<UnternehmenListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnternehmenListComponent]
    });
    fixture = TestBed.createComponent(UnternehmenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
