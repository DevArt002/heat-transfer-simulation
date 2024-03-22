import * as THREE from 'three';

import { Simulator } from 'src/helpers';
import { disposeObject } from 'src/utils';

export abstract class Entity extends THREE.Object3D {
  constructor(protected readonly _simulator: Simulator) {
    super();
  }

  // Getter of simulator
  get simulator(): Simulator {
    return this._simulator;
  }

  /**
   * Initialize system
   */
  abstract init(): void;

  /**
   * Update
   */
  abstract update(delta: number, elapsed: number): void;

  /**
   * Dispose
   */
  dispose(): void {
    disposeObject(this);
  }
}
