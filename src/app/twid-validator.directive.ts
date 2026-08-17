import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, FormControl } from '@angular/forms';
import { ValidateTwId } from './login2/ValidateTwId';

@Directive({
  selector: '[appTwid][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: TwidValidatorDirective, multi: true }
  ]
})

export class TwidValidatorDirective implements Validator {
  validate(c: FormControl): { [key: string]: any } {
    return ValidateTwId(c);
  }
}
