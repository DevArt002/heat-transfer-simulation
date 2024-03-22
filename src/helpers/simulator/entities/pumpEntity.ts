import * as THREE from 'three';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';
import { TXY } from 'src/types';

export class PumpEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    emissive: 0xff0000,
    emissiveIntensity: 0.2,
  });
  private _upTimes: TXY[] = [];
  private _startedTime: number | null = null;
  private _isStarted: boolean = false;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of flag of started status
  get isStarted(): boolean {
    return this._isStarted;
  }

  // Getter of started time
  get startedTime(): number | null {
    return this._startedTime;
  }

  // Getter of up times
  get upTimes(): TXY[] {
    return this._upTimes;
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
  }

  /**
   * Run pump
   */
  start() {
    this._material.emissive.set(0x00ff00);
    this._startedTime = this._simulator.clock.getElapsedTime();
    this._isStarted = true;
  }

  /**
   * Stop pump
   */
  stop() {
    // Try to save up time of pump
    if (this._startedTime !== null) {
      const stoppedTime = this._simulator.clock.getElapsedTime();
      this._upTimes.push([this._startedTime, stoppedTime]);
      this._startedTime = null;
    }
    this._material.emissive.set(0xff0000);
    this._isStarted = false;
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    const { _isStarted, _mesh } = this;

    // Showing running status as pulse animation
    if (!_isStarted) return;

    const scaleFactor = 1 + Math.sin(elapsed * 80) * 0.05;
    _mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    _mesh.updateMatrix();
  }
}
