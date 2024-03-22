import * as THREE from 'three';

import { DEFAULT_SOLAR_PANEL_HEIGHT, DEFAULT_SOLAR_PANEL_WIDTH } from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class SolarPanelEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _geometry: THREE.BufferGeometry = new THREE.BoxGeometry(
    DEFAULT_SOLAR_PANEL_WIDTH,
    0.2, // Default depth of solar panel
    DEFAULT_SOLAR_PANEL_HEIGHT,
  );
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
    this.updateGeometry();
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

  /**
   * Initialize system
   */
  init(): void {
    const { _mesh, _geometry, _panMaterial, _otherMaterial } = this;

    _mesh.geometry = _geometry;
    _mesh.material = [
      _otherMaterial,
      _otherMaterial,
      _panMaterial,
      _otherMaterial,
      _otherMaterial,
      _otherMaterial,
    ];
    _mesh.position.y = 0.1;

    this.add(_mesh);
  }

  /**
   * Update geometry
   */
  updateGeometry(): void {
    const { _mesh, _width, _height } = this;

    // TODO Instead of discarding outdated geometry and adding new geometry, it'd be advantageous to solely update geometry attributes.
    this._geometry.dispose();
    this._geometry = new THREE.BoxGeometry(_width, 0.2, _height);
    _mesh.geometry = this._geometry;
    _mesh.position.y = 0.1;
  }

  /**
   * Update
   */
  update(): void {
    // TODO Material update
    return;
  }
}
