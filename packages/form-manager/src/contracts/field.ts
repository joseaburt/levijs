import { ValidationResult } from "./validation";
import { ComponentType } from "react";

export interface FieldState<T> {
  value: T;
  hidden: boolean;
  disabled: boolean;
  isTouched: boolean;
  validation: ValidationResult;
}

export interface FieldBaseProps<T> extends FieldState<T[keyof T]> {
  name: keyof T;
  label: string;
  placeholder?: string;
  onChange(value: T[keyof T]): void;
  onClear(): void;
}
export interface FieldConfiguration<T> {
  name: keyof T;
  value: T[keyof T];
  render: ComponentType<FieldBaseProps<T>>;
}
