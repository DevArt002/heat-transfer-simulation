import * as THREE from 'three';

import { DEFAULT_PIPE_RADIUS } from 'src/constants';
import { Entity } from './entity';
import { Simulator } from 'src/helpers';

export class PipeEntity extends Entity {
  private _mesh: THREE.Mesh = new THREE.Mesh();
  private _material: THREE.Material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 1,
  });
  private _radius: number = DEFAULT_PIPE_RADIUS;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
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
    const { _simulator, _radius, _mesh } = this;
    const { storageTankEntity, solarPanelEntity } = _simulator;

    if (storageTankEntity === null || solarPanelEntity === null) return;

    // Define your position array which represents the path
    const points = [
      storageTankEntity.outPoint,
      solarPanelEntity.inPoint,
      solarPanelEntity.outPoint,
      storageTankEntity.inPoint,
    ];

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
