import { DynamicProviderOptions } from './dynamic-provider-options';

export interface StoreValue {
  target: Function;
  options: DynamicProviderOptions[];
}
