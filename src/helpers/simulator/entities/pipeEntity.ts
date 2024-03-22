import * as THREE from 'three';

import { DEFAULT_PIPE_HEAT_LOSS_COEFFICIENT, DEFAULT_PIPE_RADIUS } from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';
import { calculateTotalLength } from 'src/utils';

export class PipeEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.Material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 1,
  });
  private _radius: number = DEFAULT_PIPE_RADIUS;
  private _length: number = 0;
  private _heatLossCoefficient: number = DEFAULT_PIPE_HEAT_LOSS_COEFFICIENT;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of pipe length
  get length(): number {
    return this._length;
  }

  // Getter of surface area
  get area(): number {
    const { _radius, _length } = this;

    return 2 * Math.PI * _radius * _length;
  }

  // Getter of heat loss coefficient
  get heatLossCoefficient(): number {
    return this._heatLossCoefficient;
  }

  // Getter of heat loss on surface
  get heatLossSurface(): number {
    const { _heatLossCoefficient, area } = this;

    return _heatLossCoefficient * area;
  }

  // Getter of energy lossing per second
  get energyOutRate(): number {
    const {
      _simulator: { storageTankEntity },
      heatLossSurface,
    } = this;

    if (storageTankEntity === null) return 0;

    // TODO Caculating energy out from attr of storage tank is wrong.
    return heatLossSurface * storageTankEntity.deltaEnvTemp;
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _mesh, _material } = this;
    _mesh.material = _material;
    _mesh.matrixAutoUpdate = false;

    this.add(_mesh);

    // Set geometry
    this.setGeometry();
  }

  /**
   * Set geometry
   */
  setGeometry(): void {
    const { _simulator, _radius, _mesh } = this;
    const { storageTankEntity, solarPanelEntity, pumpEntity } = _simulator;

    if (storageTankEntity === null || solarPanelEntity === null || pumpEntity === null) return;

    // Define your position array which represents the path
    const points = [
      storageTankEntity.outPoint,
      pumpEntity.inPoint,
      pumpEntity.outPoint,
      solarPanelEntity.inPoint,
      solarPanelEntity.outPoint,
      storageTankEntity.inPoint,
    ];

    // Save pipe length
    this._length = calculateTotalLength(points);

    // Create a CatmullRomCurve3 using the position array
    const curve = new THREE.CatmullRomCurve3(points);

    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    // Dispose outdated one
    _mesh.geometry.dispose();

    // Create the pipe geometry
    const geometry = new THREE.TubeGeometry(curve, 64, _radius, 32, false);

    _mesh.geometry = geometry;
  }

  /**
   * Update
   */
  update(): void {
    return;
  }
}
