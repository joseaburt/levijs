import { FieldConfiguration, FieldState } from "./contracts/field";
import { IEventManager, IFormManager, Subscriber, UnSubscribe } from "./contracts/manager";
import { FormValidationResult, ValidationResult } from "./contracts/validation";

interface FormManagerProps<T> {
  defaultData: T;
  eventManager: IEventManager;
  fields: Record<keyof T, FieldConfiguration<T>>;
}

// TODO: Create an Stack Data Structure to implement Undo feature
export class FormManager<T> implements IFormManager<T> {
  private data: T;
  private defaultData: T;
  private eventManager: IEventManager;
  private fields: Record<keyof T, FieldConfiguration<T>>;
  private validation: FormValidationResult<T> = { isValid: false, invalidFields: [] };
  private fieldStates: Record<keyof T, FieldState<T[keyof T]>> = {} as Record<keyof T, FieldState<T[keyof T]>>;

  constructor(props: FormManagerProps<T>) {
    this.data = { ...props.defaultData };
    this.defaultData = { ...props.defaultData };
    this.fields = props.fields;
    this.eventManager = props.eventManager;
    for (const key in this.fields) {
      const config = this.fields[key];
      this.fieldStates[key] = {
        disabled: !!config.disabled,
        hidden: !!config.hidden,
        isTouched: false,
        value: this.data[key],
        validation: { isValid: typeof config.validate === "function" ? false : true },
      };
    }
  }

  public getData(): T {
    return { ...this.data };
  }

  public setData(data: Partial<T>): void {
    this.data = { ...this.data, ...data };
    this.validate();
  }

  public setDefaultData(data: Partial<T>): void {
    this.defaultData = { ...this.defaultData, ...data };
    this.validate();
  }

  public getDefaultData(): Partial<T> {
    return { ...this.defaultData };
  }

  public onDataChanged(handler: Subscriber<T>): UnSubscribe {
    return this.eventManager.subscribe("form:data:changed", handler);
  }

  public resetData(): void {
    this.data = { ...this.defaultData };
  }

  public validate(): boolean {
    for (const key in this.fields) {
      const configs = this.fields[key];
      const state = this.fieldStates[key];

      // A field is required when "validate" function is provided.
      if (typeof configs.validate === "function") {
        if (!state.isTouched) {
          const validationResult: ValidationResult = { isValid: false, message: "Field is required" };
          this.fieldStates[key].validation = validationResult;
          this.validation = { ...validationResult, invalidFields: [{ ...this.fieldStates[key] }] };
          this.fieldValidationChanged(key, validationResult);
          this.formValidationChanged(this.validation);
          return false;
        }

        const result = configs.validate(state.value);
        if (!result.isValid) {
          this.fieldStates[key].validation = result;
          this.fieldValidationChanged(key, result);
          this.validation = { ...result, invalidFields: [{ ...this.fieldStates[key] }] };
          this.formValidationChanged(this.validation);
          return false;
        }

        this.fieldStates[key].validation = { isValid: true };
        this.fieldValidationChanged(key, this.fieldStates[key].validation);
      }
    }

    for (const key in this.fieldStates) {
      const state = this.fieldStates[key];
      if (!state.validation.isValid) {
        this.validation = { ...state.validation, invalidFields: [{ ...state }] };
        this.formValidationChanged(this.validation);
        return false;
      }
    }

    return true;
  }

  public onValidationChanged(handler: Subscriber<FormValidationResult<T>>): UnSubscribe {
    return this.eventManager.subscribe("form:validation", handler);
  }

  public setFieldValue<K extends keyof T = keyof T>(field: K, value: T[K]): void {
    throw new Error("Method not implemented.");
  }

  public clearFieldValue<K extends keyof T = keyof T>(field: K): void {
    throw new Error("Method not implemented.");
  }

  public hideField<K extends keyof T = keyof T>(field: K): void {
    throw new Error("Method not implemented.");
  }

  public showField<K extends keyof T = keyof T>(field: K): void {
    throw new Error("Method not implemented.");
  }

  public disableField<K extends keyof T = keyof T>(field: K): void {
    throw new Error("Method not implemented.");
  }

  public enableField<K extends keyof T = keyof T>(field: K): void {
    throw new Error("Method not implemented.");
  }

  public setError<K extends keyof T = keyof T>(field: K, error: boolean, message: string): void {
    throw new Error("Method not implemented.");
  }

  public onFieldChanged<K extends keyof T = keyof T>(field: K, handler: (value: FieldState<T[K]>) => void): void {
    throw new Error("Method not implemented.");
  }

  protected fieldValidationChanged(field: keyof T, result: ValidationResult): void {
    this.eventManager.emit(`${field as string}:validation`, { ...result });
  }

  protected formValidationChanged(result: FormValidationResult<T>): void {
    this.eventManager.emit(`form:validation`, { ...result });
  }

  public undo(): void {}

  public redo(): void {}
}
