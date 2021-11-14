import { COMMAND_METADATA } from './command.constant';

function Command(): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    Reflect.defineMetadata(COMMAND_METADATA, {}, target);

    return target;
  };
}

@Command()
export class PlayCommand {}
