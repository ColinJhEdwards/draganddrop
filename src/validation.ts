namespace App {
  // Validation Logic
  // creating a interface like so will pretty much say "hey where ever i apply this as a type
  // the property should match this structure"
  export interface Validatable {
    value: string | number;
    //   the question mark indicates that the property is optional
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  export function validate(validatableInput: Validatable) {
    let isValid = true;
    //   required Check
    if (validatableInput.required) {
      isValid =
        isValid && validatableInput.value.toString().trim().length !== 0;
    }
    //   minLength Check
    if (
      validatableInput.minLength != null &&
      typeof validatableInput.value === "string"
    ) {
      isValid =
        isValid && validatableInput.value.length > validatableInput.minLength;
    }
    //   maxlength Check
    if (
      validatableInput.maxLength != null &&
      typeof validatableInput.value === "string"
    ) {
      isValid =
        isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    //   min check
    if (
      validatableInput.min != null &&
      typeof validatableInput.value === "number"
    ) {
      isValid = isValid && validatableInput.value > validatableInput.min;
    }
    //   max check
    if (
      validatableInput.max != null &&
      typeof validatableInput.value === "number"
    ) {
      isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
  }
}
