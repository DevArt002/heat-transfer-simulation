import * as THREE from 'three';

import {
  DEFAULT_FLUID_DENSITY,
  DEFAULT_INITIAL_FLUID_TEMPERATURE,
  DEFAULT_SPECIFIC_HEAT_CAPACITY_FLUID,
  DEFAULT_TANK_HEAT_LOSS_COEFFICIENT,
  DEFAULT_TANK_HEIGHT,
  DEFAULT_TANK_RADIUS,
} from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';
import { getHeatmapColor } from 'src/utils';

export class StorageTankEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 1,
    /**
     * TODO Emissive color is used for temperature representation.
     * But it's strongly recommended to make custom shader material rather than standard material
     */
    emissive: new THREE.Color(getHeatmapColor(DEFAULT_INITIAL_FLUID_TEMPERATURE)),
  });
  private _height: number = DEFAULT_TANK_HEIGHT;
  private _radius: number = DEFAULT_TANK_RADIUS;
  private _fluidTemp: number = DEFAULT_INITIAL_FLUID_TEMPERATURE;
  private _fluidDensity: number = DEFAULT_FLUID_DENSITY;
  private _heatCapacityFluid: number = DEFAULT_SPECIFIC_HEAT_CAPACITY_FLUID;
  private _heatLossCoefficient: number = DEFAULT_TANK_HEAT_LOSS_COEFFICIENT;
  private _showHeatmap: boolean = true;

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

  // Getter of surface area
  get area(): number {
    const { _radius, _height } = this;

    return 2 * Math.PI * _radius * (_radius + _height);
  }

  // Getter of volume
  get volume(): number {
    const { _radius, _height } = this;

    return Math.PI * _radius * _radius * _height;
  }

  // Getter of fluid density
  get fluidDensity(): number {
    return this._fluidDensity;
  }

  // Setter of fluid density
  set fluidDensity(value: number) {
    this._fluidDensity = value;
  }

  // Getter of mass of fluid in kg
  get fluidMass(): number {
    const { volume, _fluidDensity } = this;

    return volume * _fluidDensity;
  }

  // TODO Perhaps, would need top and bottom temperatures instead of average temperature
  // Getter of fluid temperature
  get fluidTemp(): number {
    return this._fluidTemp;
  }

  // Setter of fluid temperature
  set fluidTemp(value: number) {
    this._fluidTemp = value;
    this._material.emissive.set(getHeatmapColor(value));
  }

  // Getter of heat capacity per 1g of fluid
  get heatCapacityFluid(): number {
    return this._heatCapacityFluid;
  }

  // Setter of heat capacity
  set heatCapacityFluid(value: number) {
    this._heatCapacityFluid = value;
  }

  // Getter of heat loss coefficient
  get heatLossCoefficient(): number {
    return this._heatLossCoefficient;
  }

  // Setter of heat loss coefficient
  set heatLossCoefficient(value: number) {
    this._heatLossCoefficient = value;
  }

  // Getter of heat loss on surface
  get heatLossSurface(): number {
    const { _heatLossCoefficient, area } = this;

    return _heatLossCoefficient * area;
  }

  // Getter of delta temperature between fluid temperature and ambient temperature
  get deltaEnvTemp(): number {
    const {
      _fluidTemp,
      _simulator: { environmentEntity },
    } = this;

    if (environmentEntity === null) return 0;

    return _fluidTemp - environmentEntity.ambientTemp;
  }

  // Getter of energy lossing per second
  get energyOutRate(): number {
    const { deltaEnvTemp, heatLossSurface } = this;

    return heatLossSurface * deltaEnvTemp;
  }

  // Getter of heatmap visible state
  get showHeatmap(): boolean {
    return this._showHeatmap;
  }

  // Setter of heatmap visible state
  set showHeatmap(value: boolean) {
    this._showHeatmap = value;
    this._material.emissiveIntensity = value ? 1 : 0;
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
    _mesh.matrixAutoUpdate = false;

    this.add(_mesh);

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
