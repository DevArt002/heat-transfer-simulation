import { CAD } from 'src/helpers';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { IGUIParams } from 'src/types';

import { System } from './system';

export class GUISystem extends System {
  private _gui: GUI = new GUI();
  private _guiParams: IGUIParams = {};

  constructor(cad: CAD) {
    super(cad);

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
  init() {
    // Append to cad container
    this._cad.container.appendChild(this._gui.domElement);

    // TODO Initialize gui folders and inputs here
  }

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {
    this._gui.destroy();
  }
}
