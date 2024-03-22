import * as THREE from 'three';

import {
  DEFAULT_AMBIENT_TEMPERATURE,
  DEFAULT_LATITUDE,
  DEFAULT_SPEED,
  IS_DEV,
  SECONDS_PER_DAY,
} from 'src/constants';

import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class EnvironmentEntity extends Entity {
  private _dirLightContainer: THREE.Object3D = new THREE.Object3D();
  private _dirLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  private _ambLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040);
  private _latitude: number = DEFAULT_LATITUDE; // Latitude of location
  private _ambientTemp: number = DEFAULT_AMBIENT_TEMPERATURE; // Ambient temperature in Celsius
  private _speed: number = DEFAULT_SPEED; // 2000s = 1ms
  private _sunRotSpeed: number = ((Math.PI * 2) / SECONDS_PER_DAY) * DEFAULT_SPEED; // (360 deg) / (seconds of day) * (default spped)

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of speed
  get speed(): number {
    return this._speed;
  }

  // Setter of speed
  set speed(value: number) {
    this._speed = value;
    this._sunRotSpeed = ((Math.PI * 2) / SECONDS_PER_DAY) * value;
  }

  // Getter of sun rotation speed
  get sunRotSpeed(): number {
    return this._sunRotSpeed;
  }

  // Getter of latitude
  get latitude(): number {
    return this._latitude;
  }

  // Getter of ambient temperature
  get ambientTemp(): number {
    return this._ambientTemp;
  }

  // Setter of ambient temperature
  set ambientTemp(value: number) {
    this._ambientTemp = value;
  }

  /**
   * Initialize system
   */
  init(): void {
    const { _dirLightContainer, _dirLight, _ambLight } = this;

    _dirLight.position.set(0, -10, 0);

    _dirLightContainer.add(_dirLight);
    this.add(_dirLightContainer);
    this.add(_ambLight);

    // Add helpers in dev mode
    if (IS_DEV) {
      const dirLightHelper = new THREE.DirectionalLightHelper(_dirLight, 0.5);
      this.add(dirLightHelper);
    }
  }

  /**
   * Update
   */
  update(delta: number): void {
    const { _dirLightContainer, _sunRotSpeed } = this;

    /**
     * TODO Realtime update of directional light should drop performance.
     * Allowing since this simulation will involve minor objects.
     * Rotating point light or virtual light object should be better.
     */
    _dirLightContainer.rotateX(-_sunRotSpeed * delta);
  }
}
