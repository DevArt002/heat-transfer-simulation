import * as THREE from 'three';

import {
  Entity,
  EnvironmentEntity,
  PipeEntity,
  SolarPanelEntity,
  StorageTankEntity,
} from './entities';
import { GUISystem, StatsSystem } from './systems';

import { IS_DEV } from 'src/constants';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TEntityID } from 'src/types';
import { loadEnvMap } from 'src/utils';

export class Simulator extends THREE.EventDispatcher<any> {
  // Essential renderer parameters
  private _renderer: THREE.WebGLRenderer; // Webgl renderer
  private _scene: THREE.Scene; // Scene
  private _camera: THREE.PerspectiveCamera; // Perspective camera
  private _width: number = 1; // Canvas width
  private _height: number = 1; // Canvas height
  private _pixelRatio: number = window.devicePixelRatio; // Display ratio
  private _aspect: number = 1; // Camera aspect
  private _envMap: THREE.Texture | null = null; // Env map

  // Systems&Helpers
  private _statsSystem: StatsSystem | null = null; // Stats
  private _guiSystem: GUISystem | null = null; // GUI
  private _gridHelper: THREE.GridHelper;
  private _orbitControls: OrbitControls;

  // Entities
  private _entities: Record<TEntityID, Entity> = {}; // Entities
  private _environmentEntityId: TEntityID | null = null; // Environment entity id
  private _storageTankEntityId: TEntityID | null = null; // Storage tank entity id
  private _solarPanelEntityId: TEntityID | null = null; // Solar panel entity id
  private _pipeEntityId: TEntityID | null = null; // Pipe line entity id

  // Other
  private _clock: THREE.Clock = new THREE.Clock(); // Clock
  private _isDisposed: boolean = false;

  constructor(private readonly _container: HTMLDivElement) {
    super();
    this._width = this._container.offsetWidth || 1;
    this._height = this._container.offsetHeight || 1;
    this._aspect = this._width / this._height;

    /**
     * Initialize elements for basic renderer
     */
    // Initialize webgl renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !(this._pixelRatio > 1),
    });
    renderer.setPixelRatio(this._pixelRatio);
    renderer.setSize(this._width, this._height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._container.appendChild(renderer.domElement);

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, this._aspect, 0.1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3());
    scene.add(camera);

    // Initialize grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x00ff00);
    scene.add(gridHelper);

    // Initialize orbit controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    this._renderer = renderer;
    this._scene = scene;
    this._camera = camera;
    this._gridHelper = gridHelper;
    this._orbitControls = orbitControls;
  }

  // Getter of container
  get container(): HTMLDivElement {
    return this._container;
  }

  // Getter of width
  get width(): number {
    return this._width;
  }

  // Getter of height
  get height(): number {
    return this._height;
  }

  // Getter of pixelRatio
  get pixelRatio(): number {
    return this._pixelRatio;
  }

  // Getter of aspect
  get aspect(): number {
    return this._aspect;
  }

  // Getter of envMap
  get envMap(): THREE.Texture | null {
    return this._envMap;
  }

  // Getter of webgl renderer
  get renderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  // Getter of canvas
  get canvas(): HTMLCanvasElement {
    return this._renderer.domElement;
  }

  // Getter of Scene
  get scene(): THREE.Scene {
    return this._scene;
  }

  // Getter of camera
  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  // Getter of orbit controls
  get orbitControls(): OrbitControls {
    return this._orbitControls;
  }

  // Getter of grid helper
  get gridHelper(): THREE.GridHelper {
    return this._gridHelper;
  }

  // Getter of stats system
  get statsSystem(): StatsSystem | null {
    return this._statsSystem;
  }

  // Getter of gui system
  get guiSystem(): GUISystem | null {
    return this._guiSystem;
  }

  // Getter of environment entity
  get environmentEntity(): EnvironmentEntity | null {
    const { _environmentEntityId, _entities } = this;

    if (_environmentEntityId === null) return null;

    return _entities[_environmentEntityId] as EnvironmentEntity;
  }

  // Getter of storage tank entity
  get storageTankEntity(): StorageTankEntity | null {
    const { _storageTankEntityId, _entities } = this;

    if (_storageTankEntityId === null) return null;

    return _entities[_storageTankEntityId] as StorageTankEntity;
  }

  // Getter of solar panel entity
  get solarPanelEntity(): SolarPanelEntity | null {
    const { _solarPanelEntityId, _entities } = this;

    if (_solarPanelEntityId === null) return null;

    return _entities[_solarPanelEntityId] as SolarPanelEntity;
  }

  // Getter of pipe entity
  get pipeEntity(): PipeEntity | null {
    const { _pipeEntityId, _entities } = this;

    if (_pipeEntityId === null) return null;

    return _entities[_pipeEntityId] as PipeEntity;
  }

  /**
   * Initialize
   */
  init() {
    this.onWindowResize = this.onWindowResize.bind(this);

    // TODO Perhaps, add a loading screen while loading assets
    this.loadAssets();
    this.initEntities();
    this.initSystems();
    this.initEventListeners();

    this._clock.start();
    this._renderer.setAnimationLoop(this.update);
  }

  /**
   * Load assets
   */
  async loadAssets() {
    const envMap = await loadEnvMap('img/env.hdr', this._renderer);
    this._scene.environment = envMap;
    this._envMap = envMap;
  }

  /**
   * Initialize entities
   */
  initEntities() {
    const { _entities, _scene } = this;

    const environmentEntity = new EnvironmentEntity(this);
    this._environmentEntityId = environmentEntity.id;
    _entities[environmentEntity.id] = environmentEntity;
    _scene.add(environmentEntity);

    const storageTankEntity = new StorageTankEntity(this);
    storageTankEntity.position.set(2, 0, 0);
    this._storageTankEntityId = storageTankEntity.id;
    _entities[storageTankEntity.id] = storageTankEntity;
    _scene.add(storageTankEntity);

    const solarPanelEntity = new SolarPanelEntity(this);
    solarPanelEntity.position.set(-2, 0, 0);
    this._solarPanelEntityId = solarPanelEntity.id;
    _entities[solarPanelEntity.id] = solarPanelEntity;
    _scene.add(solarPanelEntity);

    const pipeEntity = new PipeEntity(this);
    this._pipeEntityId = pipeEntity.id;
    _entities[pipeEntity.id] = pipeEntity;
    _scene.add(pipeEntity);
  }

  /**
   * Initialize systems
   */
  initSystems() {
    if (IS_DEV) {
      this._statsSystem = new StatsSystem(this);
      this._guiSystem = new GUISystem(this);
    }
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    window.addEventListener('resize', this.onWindowResize, false);
  }

  /**
   * Dispose event listeners
   */
  disposeEventListeners() {
    window.removeEventListener('resize', this.onWindowResize, false);
  }

  /**
   * Window resize listener
   */
  onWindowResize() {
    this._width = this._container.offsetWidth;
    this._height = this._container.offsetHeight;
    this._aspect = this._width / this._height;

    this._camera.aspect = this._aspect;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._width, this._height);
  }

  /**
   * Tick
   */
  update = () => {
    const { _clock, _statsSystem, _guiSystem, _orbitControls, _entities, _isDisposed } = this;

    if (_isDisposed) {
      this._renderer.setAnimationLoop(null);
      return;
    }

    const delta = _clock.getDelta();
    const elapsed = _clock.getElapsedTime();

    // Render scene
    this.render();

    // Update systems&helpers
    _statsSystem?.update();
    _guiSystem?.update();
    _orbitControls.update();

    // Update entities
    for (const key in _entities) {
      _entities[key].update(delta, elapsed);
    }
  };

  /**
   * Render
   */
  render() {
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * Dispose
   */
  dispose() {
    const { _entities, _camera, _statsSystem, _guiSystem, _renderer, _orbitControls } = this;

    this._isDisposed = true;

    // Remove event listeners
    this.disposeEventListeners();
    // Dispose all entities
    for (const key in _entities) {
      _entities[key].dispose();
    }
    // Remove camera
    _camera.removeFromParent();
    // Dispose stats system
    _statsSystem?.dispose();
    // Dipose gui system
    _guiSystem?.dispose();
    // Dispose orbit controls
    _orbitControls.dispose();
    // Remove the canvas
    _renderer.domElement.remove();
  }
}
