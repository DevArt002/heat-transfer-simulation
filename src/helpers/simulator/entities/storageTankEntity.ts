import * as THREE from 'three';

import { DEFAULT_TANK_HEIGHT, DEFAULT_TANK_RADIUS } from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class StorageTankEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.Material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
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
    this.setGeometry();
  }

  // Getter of radius
  get radius(): number {
    return this._radius;
  }

  // Setter of radius
  set radius(value: number) {
    this._radius = value;
    this.setGeometry();
  }

  // Getter of point of the pipe inlet
  get inPoint(): THREE.Vector3 {
    const { _height, position } = this;

    const point = position.clone();
    point.y += _height - 0.1; // 0.1: padding
    return point;
  }

  // Getter of point of the pipe outlet
  get outPoint(): THREE.Vector3 {
    const point = this.position.clone();
    point.y += 0.1; // 0.1: padding

    return point;
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _mesh, _material } = this;

    _mesh.material = _material;

    this.add(_mesh);
    _mesh.matrixAutoUpdate = false;

    // Set geometry
    this.setGeometry();
  }

  /**
   * Set geometry
   */
  setGeometry(): void {
    const { _simulator, _mesh, _radius, _height } = this;

    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    _mesh.geometry.dispose();
    const geometry = new THREE.CylinderGeometry(_radius, _radius, _height, 32);
    _mesh.geometry = geometry;
    _mesh.position.y = _height / 2;
    _mesh.updateMatrix();

    // Update pipe
    _simulator.pipeEntity?.setGeometry();
  }

  /**
   * Update
   */
  update(): void {
    return;
  }
}
