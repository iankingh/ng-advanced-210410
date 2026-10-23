import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidateTwId } from './login2/ValidateTwId';

@Directive({
  standalone: false,
  selector: '[appTwid][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: TwidValidatorDirective, multi: true }
  ]
})

export class TwidValidatorDirective implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    return ValidateTwId(c);
  }
}
