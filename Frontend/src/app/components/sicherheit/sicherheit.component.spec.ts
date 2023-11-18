import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SicherheitComponent } from './sicherheit.component';

describe('SicherheitComponent', () => {
  let component: SicherheitComponent;
  let fixture: ComponentFixture<SicherheitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SicherheitComponent]
    });
    fixture = TestBed.createComponent(SicherheitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
