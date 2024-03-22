export type TEntityID = number;

export enum EGUIFolderNames {
  STORAGE_TANK = 'Storage Tank',
}

export interface IGUIParams {
  [EGUIFolderNames.STORAGE_TANK]: {
    height: number;
    radius: number;
  };
}
