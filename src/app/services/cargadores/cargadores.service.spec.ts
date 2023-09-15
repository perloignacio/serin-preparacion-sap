import { TestBed } from '@angular/core/testing';

import { CargadoresService } from './cargadores.service';

describe('CargadoresService', () => {
  let service: CargadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
