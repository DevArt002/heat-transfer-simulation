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
      .name('H (m)')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.height = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'radius', 0.5, 2)
      .name('R (m)')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.radius = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'initialFluidTemperature', 5, 80)
      .name('T (°C)')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.fluidTemp = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'fluidDensity', 500, 2000)
      .name('ρ (kg/m^3)')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.fluidDensity = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'heatCapacityFluid', 2, 10)
      .name('C (kJ/(kg·°C))')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.heatCapacityFluid = value;
      });
    storageTankFolder
      .add(_guiParams[EGUIFolderNames.STORAGE_TANK], 'heatLossCoefficient', 0, 1)
      .name('U (W/(m^2·°C))')
      .onChange((value: number) => {
        const { storageTankEntity } = this._simulator;

        if (storageTankEntity === null) return;

        storageTankEntity.heatLossCoefficient = value;
      });

    // Solar panel parameters
    const solarPanelFolder = this._gui.addFolder(EGUIFolderNames.SOLAR_PANEL);
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'width', 1, 10)
      .name('W (m)')
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.width = value;
      });
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'height', 1, 10)
      .name('H (m)')
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.height = value;
      });
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'efficiency', 0.1, 1)
      .name('η')
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.efficiency = value;
      });
    solarPanelFolder
      .add(_guiParams[EGUIFolderNames.SOLAR_PANEL], 'heatLossCoefficient', 0, 1)
      .name('U (W/(m^2·°C))')
      .onChange((value: number) => {
        const { solarPanelEntity } = this._simulator;

        if (solarPanelEntity === null) return;

        solarPanelEntity.heatLossCoefficient = value;
      });

    // Pipe parameters
    const pipeFolder = this._gui.addFolder(EGUIFolderNames.PIPE);
    pipeFolder
      .add(_guiParams[EGUIFolderNames.PIPE], 'radius', 0.01, 0.1)
      .name('R (m)')
      .onChange((value: number) => {
        const { pipeEntity } = this._simulator;

        if (pipeEntity === null) return;

        pipeEntity.radius = value;
      });
    pipeFolder
      .add(_guiParams[EGUIFolderNames.PIPE], 'heatLossCoefficient', 0, 1)
      .name('U (W/(m^2·°C))')
      .onChange((value: number) => {
        const { pipeEntity } = this._simulator;

        if (pipeEntity === null) return;

        pipeEntity.heatLossCoefficient = value;
      });

    // Environment parameters
    const envFolder = this._gui.addFolder(EGUIFolderNames.ENVIRONMENT);
    envFolder
      .add(_guiParams[EGUIFolderNames.ENVIRONMENT], 'speed', 1000, 10000)
      .name('Speed')
      .onChange((value: number) => {
        const { environmentEntity } = this._simulator;

        if (environmentEntity === null) return;

        environmentEntity.speed = value;
      });
    envFolder
      .add(_guiParams[EGUIFolderNames.ENVIRONMENT], 'ambientTemperature', -20, 40)
      .name('T-Ambient (°C)')
      .onChange((value: number) => {
        const { environmentEntity } = this._simulator;

        if (environmentEntity === null) return;

        environmentEntity.ambientTemp = value;
      });
  }

  /**
   * Enable/Disable GUI inputs
   */
  enable(enabled: boolean): void {
    if (enabled) {
      this._gui.open();
    } else {
      this.gui.close();
      // TODO Disable user interaction on inputs
    }
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
