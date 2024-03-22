import { Simulator } from 'src/helpers';

export abstract class System extends EventTarget {
  constructor(protected readonly _simulator: Simulator) {
    super();
  }

  // Getter of simulator
  get simulator(): Simulator {
    return this._simulator;
  }

  // Initialize system
  abstract init(): void;

  /**
   * Update
   */
  abstract update(delta: number, elapsed: number): void;

  /**
   * Dispose
   */
  abstract dispose(): void;
}
