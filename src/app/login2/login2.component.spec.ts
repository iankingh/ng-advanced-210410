import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Login2Component } from './login2.component';

describe('Login2Component', () => {
  let component: Login2Component;
  let fixture: ComponentFixture<Login2Component>;
  let navigate: jasmine.Spy;
  let setToken: jasmine.Spy;
  let originalBodyClass: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Login2Component ],
      imports: [ReactiveFormsModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    originalBodyClass = document.body.className;
    navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.returnValue(Promise.resolve(true));
    setToken = spyOn(localStorage, 'setItem');
    fixture = TestBed.createComponent(Login2Component);
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

  it('should reject required, format, length and Taiwan ID errors without logging in', () => {
    for (const [field, value, error] of [
      ['email', '', 'required'], ['email', 'invalid', 'email'],
      ['password', '', 'required'], ['password', 'ab', 'minlength'],
      ['password', 'a'.repeat(33), 'maxlength'], ['extra.0.twid', 'A123456788', 'twid']
    ]) {
      const control = component.form.get(field);
      const original = control.value;
      control.setValue(value);
      expect(control.hasError(error)).toBe(true);
      component.onSubmit(component.form);
      expect(setToken).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      control.setValue(original);
    }
  });

  it('should validate added rows and reset their values and interaction state', () => {
    component.addExtra();
    const extra = component.getFormArray('extra');
    expect(extra.length).toBe(4);
    extra.at(3).get('twid').setValue('A123456788');
    extra.at(3).get('twid').markAsDirty();
    extra.at(3).get('twid').markAsTouched();
    expect(component.form.invalid).toBe(true);
    component.resetForm();
    expect(extra.length).toBe(3);
    expect(component.form.value).toEqual(component.data);
    expect(component.form.valid).toBe(true);
    expect(component.form.pristine).toBe(true);
    expect(component.form.untouched).toBe(true);
  });

  it('should create the token and return to the requested URL for a valid form', () => {
    component.form.get('extra.0.twid').setValue('A123456789');
    spyOnProperty(TestBed.inject(ActivatedRoute).snapshot, 'queryParamMap', 'get')
      .and.returnValue(convertToParamMap({ returnUrl: '/page2?demo=1' }));
    component.onSubmit(component.form);
    expect(setToken).toHaveBeenCalledWith('token', 'demo-session');
    expect(navigate).toHaveBeenCalledWith('/page2?demo=1');
  });

  it('should default to the dashboard and allow empty optional IDs', () => {
    expect(component.form.valid).toBe(true);
    component.onSubmit(component.form);
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should restore the body class on destroy', () => {
    expect(document.body.className).toBe('bg-gradient-primary');
    fixture.destroy();
    expect(document.body.className).toBe(originalBodyClass);
  });
});
