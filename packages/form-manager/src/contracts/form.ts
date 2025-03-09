import { IEventManager } from "./manager";
import { FormValidationResult } from "./validation";
import { FieldConfiguration, FieldState } from "./field";

export interface FormState<T> {
  data: Partial<T>;
  defaultData: Partial<T>;
  validation: FormValidationResult<T>;
  fields: Record<keyof T, FieldConfiguration<T>>;
  fieldStates: Record<keyof T, FieldState<T[keyof T]>>;
  eventManager: IEventManager;
}
