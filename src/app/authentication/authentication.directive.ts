import {ComponentFactoryResolver, Directive, Input, OnChanges, SimpleChanges, ViewContainerRef} from '@angular/core';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';

const componentMapper = {
  signIn: SignInComponent,
  signUp: SignUpComponent,
  forgotPassword: ForgetPasswordComponent
};

@Directive({
  selector: '[appAuthentication]'
})
export class AuthenticationDirective implements OnChanges {
  @Input() public component: string;
  public componentRef;

  constructor(private _resolver: ComponentFactoryResolver, private _container: ViewContainerRef) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    this._initializeComponent();
  }

  private _initializeComponent(): void {
    this._container.clear();
    const factory = this._resolver.resolveComponentFactory(
      componentMapper[this.component]
    );
    this.componentRef = this._container.createComponent(factory);
    // this.componentRef.instance.extras = this.extras;
  }
}
