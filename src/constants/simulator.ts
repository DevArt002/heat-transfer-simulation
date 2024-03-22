import * as THREE from 'three';

import { EGUIFolderNames, IGUIParams } from 'src/types';

// Dummy three objects
export const DUMMY_VECTOR2 = new THREE.Vector2();
export const DUMMY_VECTOR3 = new THREE.Vector3();
export const DUMMY_MATRIX4 = new THREE.Matrix4();
export const DUMMY_COLOR = new THREE.Color();

// Default parameters
export const DEFAULT_TANK_HEIGHT = 1;
export const DEFAULT_TANK_RADIUS = 0.5;
export const DEFAULT_SOLAR_PANEL_WIDTH = 1.5;
export const DEFAULT_SOLAR_PANEL_HEIGHT = 2;
export const DEFAULT_PIPE_RADIUS = 0.05;

// Default gui parameters
export const DEFAULT_GUI_PARAMETERS: IGUIParams = {
  [EGUIFolderNames.STORAGE_TANK]: {
    height: DEFAULT_TANK_HEIGHT,
    radius: DEFAULT_TANK_RADIUS,
  },
  [EGUIFolderNames.SOLAR_PANEL]: {
    width: DEFAULT_SOLAR_PANEL_WIDTH,
    height: DEFAULT_SOLAR_PANEL_HEIGHT,
  },
};
