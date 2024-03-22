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
    const { _mesh, _geometry, _material, _height } = this;

    _mesh.geometry = _geometry;
    _mesh.material = _material;
    _mesh.position.y = _height / 2;

    this.add(_mesh);
  }

  /**
   * Update geometry
   */
  updateGeometry(): void {
    const { _mesh, _radius, _height } = this;

    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    this._geometry.dispose();
    this._geometry = new THREE.CylinderGeometry(_radius, _radius, _height, 32);
    _mesh.geometry = this._geometry;
    _mesh.position.y = _height / 2;
  }

  /**
   * Update
   */
  update(delta?: number, elapsed?: number): void {
    // TODO Material update
    return;
  }
}
