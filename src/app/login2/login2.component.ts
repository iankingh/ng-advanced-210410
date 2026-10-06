import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidateTwId } from './ValidateTwId';

type PlaceholderControl = FormControl & { placeholder?: string };

export interface Login2Data {
  email:        string;
  password:     string;
  isRememberMe: boolean;
  extra:        Extra[];
}

export interface Extra {
  name: string;
  tel:  string;
  twid: string;
}

@Component({
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component implements OnInit, OnDestroy {

  data: Login2Data = {
    email: 'doggy.huang@gmail.com',
    password: '123789yuiT',
    isRememberMe: true,
    extra: [
      {
        name: '1111',
        tel: '1111',
        twid: ''
      },
      {
        name: '2222',
        tel: '2222',
        twid: ''
      },
      {
        name: '3333',
        tel: '3333',
        twid: ''
      }
    ]
  };

  origClass = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.origClass = document.body.className;
    document.body.className = 'bg-gradient-primary';

    this.form = this.fb.group({
      email: new FormControl('user2@example.com', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'blur'
       }),
      password: this.fb.control('123ABCabc', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32)
        ],
        updateOn: 'change'
      }),
      isRememberMe: true,
      extra: this.fb.array([])
    });

    this.data.extra.forEach(() => {
      this.getFormArray('extra').push(this.makeExtra());
    });

    this.form.setValue(this.data);

  }

  resetForm() {
    this.getFormArray('extra').clear();

    this.data.extra.forEach(() => {
      this.getFormArray('extra').push(this.makeExtra());
    });

    this.form.reset(this.data);
  }

  makeExtra() {
    return this.fb.group({
      name: this.makeControl('輸入您的姓名(Name)'),
      tel: this.makeControl('輸入您的電話(09xx000000)'),
      twid: this.makeControl('請輸入您的身份證字號', [ValidateTwId])
    });
  }

  makeControl(placeholder: string, validators?: ValidatorFn[]): PlaceholderControl {
    const ctl = this.fb.control('') as PlaceholderControl;
    if (validators) {
      ctl.setValidators(validators);
    }
    ctl.placeholder = placeholder;
    return ctl;
  }

  showError(name: string, validation: string): boolean {
    const control = this.form.get(name);
    return control.invalid && control.dirty && control.hasError(validation);
  }

  getFormArray(name: string) {
    return this.form.get(name) as FormArray;
  }

  addExtra() {
    const extra = this.getFormArray('extra');
    extra.push(this.makeExtra());
  }

  onSubmit(form: FormGroup): void {
    if (form.valid) {
      // Fixed client-side demo marker only; no credentials are authenticated.
      localStorage.setItem('token', 'demo-session');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    }
  }

  ngOnDestroy(): void {
    document.body.className = this.origClass;
  }

}
