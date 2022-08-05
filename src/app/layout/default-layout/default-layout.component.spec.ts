import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DefaultLayoutComponent } from './default-layout.component';
import { SharedModule } from '../../modules/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DefaultLayoutComponent', () => {
  let component: DefaultLayoutComponent;
  let fixture: ComponentFixture<DefaultLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, SharedModule, RouterTestingModule, NgIdleKeepaliveModule,
        BrowserAnimationsModule, TranslateModule.forRoot()],
      declarations: [DefaultLayoutComponent],
      providers: [TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create top menu', () => {
    expect(document.querySelectorAll('.top-bar .menu-item').length === 4).toBeTruthy();
  });

  it('should create side menu', () => {
    expect(document.querySelector('.side-nav-container').childNodes.length === 6).toBeTruthy();
  });
});
