import { Type } from '@nestjs/common';
import { Pattern } from '../definition/pattern';
import { StoreValue } from '../definition/store-value';
import { DynamicProviderOptions } from '../definition/dynamic-provider-options';
import { ResolveFileService } from '../service/resolve-file.service';
import { isDynamicProviderOptions } from '../definition/guard/is-dynamic-provider-options';
import { isPattern } from '../definition/guard/is-pattern';

const store: StoreValue[] = [];

/**
 * Add providers into module by glob pattern.
 */
export function InjectDynamicProviders(
  ...options: DynamicProviderOptions[]
): ClassDecorator;
export function InjectDynamicProviders(...patterns: Pattern[]): ClassDecorator;
export function InjectDynamicProviders(...options: any[]): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    if (isDynamicProviderOptions(options)) store.push({ target, options });
    if (isPattern(options))
      store.push({ target, options: options.map((pattern) => ({ pattern })) });

    return target;
  };
}

/**
 * Init function.
 */
export async function resolveDynamicProviders(): Promise<void> {
  await Promise.all(
    store.map(async ({ target, options }) => {
      const resolveFileService = new ResolveFileService();
      const resolvedProviders = await resolveFileService.resolveByGlobPattern(
        options,
      );

      resolvedProviders.forEach(({ types, exportProviders }) => {
        mergeProviders(target, types);
        if (exportProviders) {
          mergeExportedProviders(target, types);
        }
      });
    }),
  );
}

function mergeProviders(target: Function, types: Type[]): void {
  const currentProviders = Reflect.getMetadata('providers', target) ?? [];
  Reflect.defineMetadata('providers', [...currentProviders, ...types], target);
}

function mergeExportedProviders(target: Function, types: Type[]): void {
  const currentExportedProviders = Reflect.getMetadata('exports', target) ?? [];
  Reflect.defineMetadata(
    'exports',
    [...currentExportedProviders, ...types],
    target,
  );
}
