export type TEntityID = number;

export enum ESimulatorEvents {
  STARTED = 'Started',
  STOPPED = 'Stopped',
  PUMP_STATUS_UPDATED = 'Pump Status Updated',
  DATA_UPDATED = 'Date Updated',
}

export enum EGUIFolderNames {
  STORAGE_TANK = 'Storage Tank',
  SOLAR_PANEL = 'Solar Panel',
  PIPE = 'Pipe',
  ENVIRONMENT = 'Environment',
  OTHER = 'Other',
}

export interface ISimulatorDataUpdatedPayload {
  elapsed: number;
  temperature: number;
}

export interface ISimulatorPumpLogPayload {
  message: string;
  status: 'on' | 'off';
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
  [EGUIFolderNames.OTHER]: {
    heatmap: boolean;
  };
}
