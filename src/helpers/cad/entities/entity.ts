import * as THREE from 'three';
import { CAD } from 'src/helpers';
import { disposeObject } from 'src/utils';

export abstract class Entity extends THREE.Object3D {
  constructor(protected readonly _cad: CAD) {
    super();
  }

  // Getter of CAD
  get cad(): CAD {
    return this._cad;
  }

  // Initialize system
  abstract init(): void;

  /**
   * Update
   */
  abstract update(delta?: number, elapsed?: number): void;

  /**
   * Dispose
   */
  dispose() {
    disposeObject(this);
  }
}
