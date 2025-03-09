import { FormValidationResult } from "./validation";
import { FieldConfiguration, FieldState } from "./field";

export type UnSubscribe = () => void;
export type Subscriber<T = never> = (data?: T) => void;

export interface EventManager {
  emit<T = never>(event: string, data: T): void;
  subscribe<T = never>(event: string, handler: Subscriber<T>): UnSubscribe;
}

export interface FormManager<T> {
  getData(): T | FormValidationResult<T>;
  setData(data: Partial<T>): void;
  setDefaultData(data: Partial<T>): void;
  getDefaultData(): Partial<T>;
  onDataChanged(handler: (data: T) => void): void;
  resetData(): void;
  isValid(): boolean;
  onIsValid(handler: (result: FormValidationResult<T>) => void): void;

  setFieldConfiguration(config: FieldConfiguration<T>): void;

  // Fields
  setFieldState<K extends keyof T = keyof T>(field: K, value: T[K]): void;
  clearFieldState<K extends keyof T = keyof T>(field: K): void;
  hideField<K extends keyof T = keyof T>(field: K): void;
  showField<K extends keyof T = keyof T>(field: K): void;
  disableField<K extends keyof T = keyof T>(field: K): void;
  enableField<K extends keyof T = keyof T>(field: K): void;
  setError<K extends keyof T = keyof T>(field: K, error: boolean, message: string): void;
  onFieldChanged<K extends keyof T = keyof T>(field: K, handler: (value: FieldState<T[K]>) => void): void;
}
