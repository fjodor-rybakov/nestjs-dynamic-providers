import { Injectable } from '@nestjs/common';
import { Hippo } from '../group-one/hippo.wild';
import { Lion } from '../group-one/lion.wild';

@Injectable()
export class Veterinarian {
  constructor(private readonly hippo: Hippo, private readonly lion: Lion) {}
}
