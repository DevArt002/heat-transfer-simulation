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
export const DEFAULT_LATITUDE = 40.7128; // Latitude of the location (e.g., New York City)
export const DEFAULT_SPEED = 2000 * 1000; // 2000s = 1ms
export const DEFAULT_AMBIENT_TEMPERATURE = 20; // Celsius
export const DEFAULT_INITIAL_FLUID_TEMPERATURE = 25; // Celsius
export const DEFAULT_FLUID_DENSITY = 1000 * 1000; // Grams per cubic meter, g/m^3 e.g. Water's density
export const DEFAULT_SPECIFIC_HEAT_CAPACITY_FLUID = 4.18; // Joules per gram per degree Celsius, e.g. water
export const DEFAULT_TANK_HEAT_LOSS_COEFFICIENT = 0.5; // Watts per square meter per degree Celsius on surface of storage tank
export const DEFAULT_SOLAR_PANEL_EFFICIENCY = 0.5; // Efficiency factor representing how effectively the solar panel converts solar radiation into heat.
export const DEFAULT_SOLAR_PANEL_HEAT_LOSS_COEFFICIENT = 2; // Watts per square meter per degree Celsius on surface of solar panel

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
