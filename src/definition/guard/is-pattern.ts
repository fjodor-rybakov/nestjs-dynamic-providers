import { Pattern } from '../pattern';

export function isPattern(param: any[]): param is Pattern[] {
  return typeof param[0] === 'string';
}
