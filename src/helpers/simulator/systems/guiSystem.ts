import { EGUIFolderNames, IGUIParams } from 'src/types';

import { DEFAULT_GUI_PARAMETERS } from 'src/constants';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { Simulator } from 'src/helpers';
import { System } from './system';

export class GUISystem extends System {
  private _gui: GUI = new GUI();
  private _guiParams: IGUIParams = DEFAULT_GUI_PARAMETERS;

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
    const { _guiParams } = this;

    // Append to simulator container
    this._simulator.container.appendChild(this._gui.domElement);

    // Storage tank parameters
    const storageTankFolder = this._gui.addFolder(EGUIFolderNames.STORAGE_TANK);
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'height', 1, 4)
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.height = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'radius', 0.5, 2)
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.radius = value;
      });

    // Solar panel parameters
    const solarPanelFolder = this._gui.addFolder(EGUIFolderNames.SOLAR_PANEL);
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'width', 1, 3)
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.width = value;
      });
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'height', 1, 3)
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.height = value;
      });
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
