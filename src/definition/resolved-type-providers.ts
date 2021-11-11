import { Type } from '@nestjs/common';
import { DynamicProviderOptions } from './dynamic-provider-options';

export type ResolvedTypeProviders = {
  types: Type[];
} & Omit<DynamicProviderOptions, 'pattern'>;
