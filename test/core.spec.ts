import { InjectDynamicProviders, resolveDynamicProviders } from '../src';
import { Module, ModuleMetadata } from '@nestjs/common';
import { Hippo } from './__fixture__/group-one/hippo.wild';
import { Lion } from './__fixture__/group-one/lion.wild';
import { Veterinarian } from './__fixture__/not-for-search/veterinarian';
import { Cat } from './__fixture__/group-two/cat.pet';
import { Dog } from './__fixture__/group-two/dog.pet';

describe('Dynamic module', () => {
  it('should set providers into module', async () => {
    @InjectDynamicProviders('**/*.wild.ts')
    @Module({})
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Hippo, Lion];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should concat providers in module', async () => {
    @InjectDynamicProviders('**/*.wild.ts')
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Veterinarian, Hippo, Lion];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should find by two patterns', async () => {
    @InjectDynamicProviders('**/*.wild.ts', '**/*.pet.ts')
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult = Reflect.getMetadata('providers', AnimalModule);
    const expectResult = [Veterinarian, Hippo, Lion, Cat, Dog];

    expect(actualResult).toStrictEqual(expectResult);
  });

  it('should add providers and set them to exports into module', async () => {
    @InjectDynamicProviders(
      {
        pattern: '**/*.wild.ts',
        exportProviders: true,
      },
      { pattern: '**/*.pet.ts' },
    )
    @Module({ providers: [Veterinarian] })
    class AnimalModule {}

    await resolveDynamicProviders();

    const actualResult: ModuleMetadata = {
      providers: Reflect.getMetadata('providers', AnimalModule),
      exports: Reflect.getMetadata('exports', AnimalModule),
    };
    const expectResult: ModuleMetadata = {
      providers: [Veterinarian, Hippo, Lion, Cat, Dog],
      exports: [Hippo, Lion],
    };

    expect(actualResult).toStrictEqual(expectResult);
  });
});
