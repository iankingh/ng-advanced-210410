import { FormControl } from '@angular/forms';
import { ValidateTwId } from './ValidateTwId';
import { TwidValidatorDirective } from '../twid-validator.directive';

describe('Taiwan ID validator', () => {
  ['', null, undefined, 'A123456789'].forEach(value => {
    it(`should accept an optional empty value or valid checksum (${value})`, () => {
      expect(ValidateTwId(new FormControl(value))).toBeNull();
    });
  });

  ['A123456788', 'A323456789', '1234567890', 'A123', ' A123456789 '].forEach(value => {
    it(`should reject invalid format or checksum (${value})`, () => {
      expect(ValidateTwId(new FormControl(value))).toEqual({ twid: true });
    });
  });

  it('should apply the same checksum rules through the template-driven directive', () => {
    const directive = new TwidValidatorDirective();
    expect(directive.validate(new FormControl('A123456789'))).toBeNull();
    expect(directive.validate(new FormControl('A123456788'))).toEqual({ twid: true });
    expect(directive.validate(new FormControl(''))).toBeNull();
  });
});
