<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://github.com/fjodor-rybakov/discord-nestjs/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://paypal.com/paypalme/fjodorrybakov"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
</p>

## 🧾 Description

Do you have many classes of the same type and adding each of them to the module is burdensome?
This package was created in order to be able to add providers to the module using the glob pattern.

## 👨🏻‍💻 Installation <a name="Installation"></a>

```bash
$ npm install nestjs-dynamic-providers
```

Or via yarn

```bash
$ yarn add nestjs-dynamic-providers
```

## ▶️ Usage <a name="Usage"></a>

First you need to call the initialization function in bootstrap.

```typescript
/* main.ts */

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.createApplicationContext(AppModule);
  await app.init();
}

bootstrap();
```

Then just add `@InjectDynamicProviders` decorator to the module. The sample below will add to the providers of the module
all classes that it finds in files that end in `.animal.js`

- `@InjectDynamicProviders` decorator takes list of glob patterns or list of options as parameters.

> ⚠️**Important! Files are searched from the startup root in build directory, so the extension must be `js`.**

```typescript
/* animal.module.ts */

import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { AnyOtherProvider } from './any-other-provider';

@InjectDynamicProviders('**/*.animal.js')
@Module({
  providers: [AnyOtherProvider], // Will [AnyOtherProvider, Hippo, Lion]
})
export class AnimalModule {}
```

```typescript
/* hippo.animal.ts */
import { Injectable } from '@nestjs/common';

@Injectable()
export class Hippo {}
```

```typescript
/* lion.animal.ts */

import { Injectable } from '@nestjs/common';

@Injectable()
export class Lion {}
```

You can also add providers to exports.

```typescript
/* animal.module.ts */

import { Module } from '@nestjs/common';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { AnyOtherProvider } from './any-other-provider';

@InjectDynamicProviders({ pattern: '**/*.animal.js', exportProviders: true })
@Module({
  providers: [AnyOtherProvider], // Will [AnyOtherProvider, Hippo, Lion]
  exports: [AnyOtherProvider], // Will [AnyOtherProvider, Hippo, Lion]
})
export class AnimalModule {}
```
