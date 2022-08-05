import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarContentComponent } from './top-bar-content.component';

describe('TopBarContentComponent', () => {
  let component: TopBarContentComponent;
  let fixture: ComponentFixture<TopBarContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
