import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { SharedModule } from '../../modules/shared/shared.module';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    component.absolutePosition = true;
    component.diameter = 50;
    component.show = true;
    component.transparent = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create mat-progress-spinner', () => {
    const matElement = document.getElementsByTagName('mat-progress-spinner');
    expect(matElement.length !== 0).toBe(true);
  });
});
