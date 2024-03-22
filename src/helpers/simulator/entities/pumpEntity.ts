import * as THREE from 'three';

import { DEFAULT_PUMP_FLOW_RATE } from 'src/constants';
import { Entity } from './entity';
import { Simulator } from 'src/helpers';
import { TXY } from 'src/types';

export class PumpEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
    emissive: 0xff0000,
    emissiveIntensity: 0.2,
  });
  private _flowRate: number = DEFAULT_PUMP_FLOW_RATE; // TODO This attr is not being used anywhere. Need to apply this somewhere proper
  private _upTimes: TXY[] = [];
  private _startedTime: number | null = null;
  private _isRunning: boolean = false;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of flow rate
  get flowRate(): number {
    return this._flowRate;
  }

  // Getter of flag of running status
  get isRunning(): boolean {
    return this._isRunning;
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
    this._isRunning = true;
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
    this._isRunning = false;
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    const { _isRunning, _mesh } = this;

    // Showing running status as pulse animation
    if (!_isRunning) return;

    const scaleFactor = 1 + Math.sin(elapsed * 80) * 0.05;
    _mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
    _mesh.updateMatrix();
  }
}
