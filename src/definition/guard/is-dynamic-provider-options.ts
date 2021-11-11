import { DynamicProviderOptions } from '../dynamic-provider-options';

export function isDynamicProviderOptions(
  param: any[],
): param is DynamicProviderOptions[] {
  return typeof param[0] === 'object';
}
