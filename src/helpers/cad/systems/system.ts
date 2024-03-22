import { CAD } from 'src/helpers';

export abstract class System {
  constructor(protected readonly _cad: CAD) {}

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
  abstract dispose(): void;
}
