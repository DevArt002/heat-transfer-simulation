import * as THREE from 'three';

import {
  DEFAULT_SOLAR_PANEL_EFFICIENCY,
  DEFAULT_SOLAR_PANEL_HEAT_LOSS_COEFFICIENT,
  DEFAULT_SOLAR_PANEL_HEIGHT,
  DEFAULT_SOLAR_PANEL_WIDTH,
} from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class SolarPanelEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _panMaterial: THREE.Material = new THREE.MeshStandardMaterial({
    color: 0x000000,
    roughness: 0,
    metalness: 0.8,
    opacity: 0.5,
    transparent: true,
  }); // Material for glass side of flat collector
  private _otherMaterial: THREE.Material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  }); // Material for other sides
  private _width: number = DEFAULT_SOLAR_PANEL_WIDTH;
  private _height: number = DEFAULT_SOLAR_PANEL_HEIGHT;
  private _efficiency: number = DEFAULT_SOLAR_PANEL_EFFICIENCY;
  private _heatLossCoefficient: number = DEFAULT_SOLAR_PANEL_HEAT_LOSS_COEFFICIENT;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of width
  get width(): number {
    return this._width;
  }

  // Setter of width
  set width(value: number) {
    this._width = value;
    this.setGeometry();
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

  // Getter of area
  get area(): number {
    const { _width, _height } = this;

    return _width * _height;
  }

  // Getter of efficiency
  get efficiency(): number {
    return this._efficiency;
  }

  // Getter of heat loss coefficient
  get heatLoosCoefficient(): number {
    return this._heatLossCoefficient;
  }

  // Getter of point of the pipe inlet
  get inPoint(): THREE.Vector3 {
    const { _width, _height, position } = this;

    const point = position.clone();
    point.x += _width / 2 - 0.1; // 0.1: padding
    point.y += 0.1;
    point.z += _height / 2;

    return point;
  }

  // Getter of point of the pipe outlet
  get outPoint(): THREE.Vector3 {
    const { _width, _height, position } = this;

    const point = position.clone();
    point.x += _width / 2 - 0.1; // 0.1: padding
    point.y += 0.1;
    point.z -= _height / 2;

    return point;
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _mesh, _panMaterial, _otherMaterial } = this;

    _mesh.material = [
      _otherMaterial,
      _otherMaterial,
      _panMaterial,
      _otherMaterial,
      _otherMaterial,
      _otherMaterial,
    ];
    _mesh.matrixAutoUpdate = false;

    this.add(_mesh);

    // Set geometry
    this.setGeometry();
  }

  /**
   * Set geometry
   */
  setGeometry(): void {
    const { _simulator, _mesh, _width, _height } = this;

    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    _mesh.geometry.dispose();
    const geometry = new THREE.BoxGeometry(_width, 0.2, _height);
    _mesh.geometry = geometry;
    _mesh.position.y = 0.1;
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
