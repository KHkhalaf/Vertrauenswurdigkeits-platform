import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnternehmenWebseiteComponent } from './unternehmen-webseite.component';

describe('UnternehmenWebseiteComponent', () => {
  let component: UnternehmenWebseiteComponent;
  let fixture: ComponentFixture<UnternehmenWebseiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnternehmenWebseiteComponent]
    });
    fixture = TestBed.createComponent(UnternehmenWebseiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
