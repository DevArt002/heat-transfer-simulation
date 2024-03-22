import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class PipeEntity extends Entity {
  constructor(simulator: Simulator) {
    super(simulator);
  }

  /**
   * Initialize system
   */
  init(): void {
    return;
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    return;
  }
}
