import { FieldState } from "./field";

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FormValidationResult<T> {
  isValid: boolean;
  message?: string;
  invalidFields: FieldState<T[keyof T]>[];
}
