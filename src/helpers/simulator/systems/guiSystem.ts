import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { IGUIParams } from 'src/types';
import { Simulator } from 'src/helpers';
import { System } from './system';

export class GUISystem extends System {
  private _gui: GUI = new GUI();
  private _guiParams: IGUIParams = {};

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of gui
  get gui(): GUI {
    return this._gui;
  }

  // Getter of guiParams
  get guiParams(): IGUIParams {
    return this._guiParams;
  }

  /**
   * Initialize
   */
  init(): void {
    // Append to simulator container
    this._simulator.container.appendChild(this._gui.domElement);

    // TODO Initialize gui folders and inputs here
  }

  /**
   * Update
   */
  update(): void {
    return;
  }

  /**
   * Dispose
   */
  dispose(): void {
    this._gui.destroy();
  }
}
