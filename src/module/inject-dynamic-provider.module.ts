import { DynamicModule, Module } from '@nestjs/common';
import { Pattern } from '../definition/pattern';
import { DynamicProviderOptions } from '../definition/dynamic-provider-options';
import { ResolveFileService } from '../service/resolve-file.service';

@Module({})
export class InjectDynamicProviderModule {
  static async forFeature(...patterns: Pattern[]): Promise<DynamicModule> {
    const options: DynamicProviderOptions[] = patterns.map((pattern) => ({
      pattern,
    }));

    const resolveFileService = new ResolveFileService();
    const resolvedProviders = await resolveFileService.resolveByGlobPattern(
      options,
    );

    const providers = resolvedProviders.map(({ types }) => types).flat();

    return {
      module: InjectDynamicProviderModule,
      providers,
      exports: providers,
    };
  }
}
