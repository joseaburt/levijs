import { FormValidationResult } from "./validation";
import { FieldState } from "./field";

interface UndoRedo<T> {
  undo(): void;
  redo(): void;
}

export type UnSubscribe = () => void;
export type Subscriber<T = never> = (data?: T) => void;

export interface IEventManager {
  emit<T = never>(event: string, data: T): void;
  subscribe<T = never>(event: string, handler: Subscriber<T>): UnSubscribe;
}

export interface IFormManager<T> extends UndoRedo<T> {
  getData(): T | FormValidationResult<T>;
  setData(data: Partial<T>): void;
  setDefaultData(data: Partial<T>): void;
  getDefaultData(): Partial<T>;
  onDataChanged(handler: Subscriber<T>): UnSubscribe;
  resetData(): void;
  validate(): boolean;
  onValidationChanged(handler: Subscriber<FormValidationResult<T>>): UnSubscribe;

  // Fields
  setFieldValue<K extends keyof T = keyof T>(field: K, value: T[K]): void;
  clearFieldValue<K extends keyof T = keyof T>(field: K): void;
  hideField<K extends keyof T = keyof T>(field: K): void;
  showField<K extends keyof T = keyof T>(field: K): void;
  disableField<K extends keyof T = keyof T>(field: K): void;
  enableField<K extends keyof T = keyof T>(field: K): void;
  setError<K extends keyof T = keyof T>(field: K, error: boolean, message: string): void;
  onFieldChanged<K extends keyof T = keyof T>(field: K, handler: (value: FieldState<T[K]>) => void): void;
}
