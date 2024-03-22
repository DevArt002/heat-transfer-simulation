import * as THREE from 'three';

import { DEFAULT_TANK_HEIGHT, DEFAULT_TANK_RADIUS } from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class StorageTankEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(
    DEFAULT_TANK_RADIUS,
    DEFAULT_TANK_RADIUS,
    DEFAULT_TANK_HEIGHT,
    32,
  );
  private _material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  private _height: number = DEFAULT_TANK_HEIGHT;
  private _radius: number = DEFAULT_TANK_RADIUS;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of height
  get height(): number {
    return this._height;
  }

  // Setter of height
  set height(value: number) {
    this._height = value;
    this.updateGeometry();
  }

  // Getter of radius
  get radius(): number {
    return this._radius;
  }

  // Setter of radius
  set radius(value: number) {
    this._radius = value;
    this.updateGeometry();
  }

  /**
   * Initialize system
   */
  init(): void {
    this._mesh.geometry = this._geometry;
    this._mesh.material = this._material;
    this._mesh.position.y = this._height / 2;

    this.add(this._mesh);
  }

  /**
   * Update geometry
   */
  updateGeometry(): void {
    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    this._geometry.dispose();
    this._geometry = new THREE.CylinderGeometry(this._radius, this._radius, this._height, 32);
    this._mesh.geometry = this._geometry;
    this._mesh.position.y = this._height / 2;
  }

  /**
   * Update
   */
  update(delta?: number, elapsed?: number): void {
    // TODO Material update
    return;
  }
}
