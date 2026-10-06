import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { TwidValidatorDirective } from '../twid-validator.directive';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let navigate: jasmine.Spy;
  let setToken: jasmine.Spy;
  let originalBodyClass: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent, TwidValidatorDirective ],
      imports: [FormsModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    originalBodyClass = document.body.className;
    navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.returnValue(Promise.resolve(true));
    setToken = spyOn(localStorage, 'setItem');
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    document.body.className = originalBodyClass;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid fields and Taiwan ID checksums without creating a token', async () => {
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    for (const [field, value] of [['email', 'invalid'], ['password', 'abc'], ['extra.tel', '123'],
      ['extra.twid', 'A123456788']]) {
      const control = form.form.get(field);
      const original = control.value;
      control.setValue(value);
      expect(form.invalid).toBe(true);
      component.onSubmit(form);
      expect(setToken).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      control.setValue(original);
    }
  });

  it('should create the demo token and return to the preserved URL only when valid', async () => {
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    form.form.get('extra.twid').setValue('A123456789');
    spyOnProperty(TestBed.inject(ActivatedRoute).snapshot, 'queryParamMap', 'get')
      .and.returnValue(convertToParamMap({ returnUrl: '/components/cards?view=all' }));
    expect(form.valid).toBe(true);
    component.onSubmit(form);
    expect(setToken).toHaveBeenCalledWith('token', 'demo-session');
    expect(navigate).toHaveBeenCalledWith('/components/cards?view=all');
  });

  it('should default to the dashboard with optional extra fields left empty', async () => {
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    expect(form.valid).toBe(true);
    component.onSubmit(form);
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should restore the body class on destroy', () => {
    expect(document.body.className).toBe('bg-gradient-primary');
    fixture.destroy();
    expect(document.body.className).toBe(originalBodyClass);
  });
});
