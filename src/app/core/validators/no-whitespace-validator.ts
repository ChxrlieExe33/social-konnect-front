import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isValid = control.value && !/\s/.test(control.value);
        return isValid ? null : { whitespace: true };
    };
}
