import * as THREE from 'three';

import { Entity } from './entity';
import { IS_DEV } from 'src/constants';
import { Simulator } from 'src/helpers';

export class EnvironmentEntity extends Entity {
  private _dirLightContainer: THREE.Object3D = new THREE.Object3D();
  private _dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  private _ambLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _dirLightContainer, _dirLight, _ambLight } = this;

    _dirLight.position.set(0, 6, 0);

    _dirLightContainer.add(_dirLight);
    this.add(_dirLightContainer);
    this.add(_ambLight);

    // Add helpers in dev mode
    if (IS_DEV) {
      const dirLightHelper = new THREE.DirectionalLightHelper(_dirLight, 0.5);
      this.add(dirLightHelper);
    }
  }

  /**
   * Update
   */
  update(delta?: number, elapsed?: number): void {
    if (delta === undefined) return;

    /**
     * TODO Realtime update of directional light should drop performance.
     * Allowing since this simulation will involve minor objects.
     * Rotating point light or virtual light object should be better.
     */
    this._dirLightContainer.rotateX(-delta);
  }
}
