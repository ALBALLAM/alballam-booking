import { TestBed, inject } from '@angular/core/testing';

import { DefaultLayoutService } from './default-layout.service';
import { HttpClientModule } from '@angular/common/http';

describe('DefaultLayoutService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DefaultLayoutService]
    });
  });

  it('should be created', inject([DefaultLayoutService], (service: DefaultLayoutService) => {
    expect(service).toBeTruthy();
  }));
});
