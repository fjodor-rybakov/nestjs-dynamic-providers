import { DynamicProviderOptions } from '../definition/dynamic-provider-options';
import { ResolvedTypeProviders } from '../definition/resolved-type-providers';
import { SCOPE_OPTIONS_METADATA } from '@nestjs/common/constants';
import { Type } from '@nestjs/common';
import { glob } from 'glob';
import { IsObject } from '../utils/function/is-object';

export class ResolveFileService {
  async resolveByGlobPattern(
    options: DynamicProviderOptions[],
  ): Promise<ResolvedTypeProviders[]> {
    const classesList = await Promise.all(
      options.map(({ pattern, exportProviders, filterPredicate, scope }) =>
        glob(pattern).then(async (pathToFiles) => {
          const types = (await this.getClasses(pathToFiles)).flat();

          if (!filterPredicate)
            filterPredicate = (type) =>
              IsObject(type) &&
              Reflect.hasOwnMetadata(SCOPE_OPTIONS_METADATA, type);

          return {
            types: types.filter(filterPredicate),
            exportProviders,
            scope,
          };
        }),
      ),
    );

    return classesList.flat();
  }

  private getClasses(pathToFiles: string[]): Promise<Type[][]> {
    return Promise.all(
      pathToFiles.map(async (pathToFile: string) => {
        const path = await import('path');
        const resolvedPath = path.resolve(process.cwd(), pathToFile);
        const resolvedClass = await import(resolvedPath);

        return Object.values<Type>(resolvedClass);
      }),
    );
  }
}
