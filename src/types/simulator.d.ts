export type TEntityID = number;

export type TXY = [number, number];

export type TXYZ = [number, number, number];

export enum ESimulatorEvents {
  START = 'Start',
  STOP = 'STOP',
  PUMP_RUNNING = 'Pump Running',
}

export enum EGUIFolderNames {
  STORAGE_TANK = 'Storage Tank',
  SOLAR_PANEL = 'Solar Panel',
  PIPE = 'Pipe',
  ENVIRONMENT = 'Environment',
}

export interface IGUIParams {
  [EGUIFolderNames.STORAGE_TANK]: {
    height: number;
    radius: number;
    initialFluidTemperature: number;
    fluidDensity: number;
    heatCapacityFluid: number;
    heatLossCoefficient: number;
  };
  [EGUIFolderNames.SOLAR_PANEL]: {
    width: number;
    height: number;
    efficiency: number;
    heatLossCoefficient: number;
  };
  [EGUIFolderNames.PIPE]: {
    radius: number;
    heatLossCoefficient: number;
  };
  [EGUIFolderNames.ENVIRONMENT]: {
    speed: number;
    ambientTemperature: number;
  };
}
