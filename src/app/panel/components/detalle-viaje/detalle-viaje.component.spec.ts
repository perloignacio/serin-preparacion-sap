import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleViajeComponent } from './detalle-viaje.component';

describe('DetalleViajeComponent', () => {
  let component: DetalleViajeComponent;
  let fixture: ComponentFixture<DetalleViajeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleViajeComponent]
    });
    fixture = TestBed.createComponent(DetalleViajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
