import * as THREE from 'three';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class PumpEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 0.2,
  });
  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of point of the pipe inlet
  get inPoint(): THREE.Vector3 {
    const point = this.position.clone();
    point.x += 0.1; // 0.1: padding

    return point;
  }

  // Getter of point of the pipe outlet
  get outPoint(): THREE.Vector3 {
    const point = this.position.clone();
    point.x -= 0.1; // 0.1: padding

    return point;
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _mesh, _material } = this;

    _mesh.geometry = new THREE.DodecahedronGeometry(0.2);
    _mesh.material = _material;
    _mesh.matrixAutoUpdate = false;
    _mesh.updateMatrix();

    this.add(_mesh);

    this.run();
  }

  /**
   * Run pump
   */
  run() {
    this._material.emissive.set(0x00ff00);
  }

  /**
   * Stop pump
   */
  stop() {
    this._material.emissive.set(0xff0000);
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    return;
  }
}
