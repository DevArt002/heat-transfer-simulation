export type TEntityID = number;

export enum EGUIFolderNames {
  STORAGE_TANK = 'Storage Tank',
  SOLAR_PANEL = 'Solar Panel',
}

export interface IGUIParams {
  [EGUIFolderNames.STORAGE_TANK]: {
    height: number;
    radius: number;
  };
  [EGUIFolderNames.SOLAR_PANEL]: {
    width: number;
    height: number;
  };
}
