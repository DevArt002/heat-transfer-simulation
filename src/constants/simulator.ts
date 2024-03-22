import * as THREE from 'three';

import { EGUIFolderNames, IGUIParams } from 'src/types';

// Dummy three objects
export const DUMMY_VECTOR2 = new THREE.Vector2();
export const DUMMY_VECTOR3 = new THREE.Vector3();
export const DUMMY_MATRIX4 = new THREE.Matrix4();
export const DUMMY_COLOR = new THREE.Color();

// Default parameters
export const SECONDS_PER_DAY = 24 * 60 * 60;
export const EXPECTED_MAX_TEMPERATURE = 90;
export const EXPECTED_MIN_TEMPERATURE = 60;
export const DEFAULT_TANK_HEIGHT = 1;
export const DEFAULT_TANK_RADIUS = 0.5;
export const DEFAULT_SOLAR_PANEL_WIDTH = 4;
export const DEFAULT_SOLAR_PANEL_HEIGHT = 3;
export const DEFAULT_LATITUDE = 40.7128; // Latitude of the location (e.g., New York City)
export const DEFAULT_SPEED = 2000; // 2000s = 1s
export const DEFAULT_AMBIENT_TEMPERATURE = 20; // Celsius
export const DEFAULT_INITIAL_FLUID_TEMPERATURE = 25; // Celsius
export const DEFAULT_FLUID_DENSITY = 1000; // Kg per cubic meter, kg/m^3 e.g. Water's density
export const DEFAULT_SPECIFIC_HEAT_CAPACITY_FLUID = 4.18; // kJ/(kg·°C), e.g. water
export const DEFAULT_TANK_HEAT_LOSS_COEFFICIENT = 1; // Joules per square meter per degree Celsius on surface of storage tank
export const DEFAULT_SOLAR_PANEL_EFFICIENCY = 0.5; // Efficiency factor representing how effectively the solar panel converts solar radiation into heat.
export const DEFAULT_SOLAR_PANEL_HEAT_LOSS_COEFFICIENT = 0.1; // Joules per square meter per degree Celsius on surface of solar panel
export const DEFAULT_PIPE_RADIUS = 0.05;
export const DEFAULT_PIPE_HEAT_LOSS_COEFFICIENT = 0.02; // Joules per square meter per degree Celsius on surface of pipe line
export const DEFAULT_PUMP_FLOW_RATE = 0.01; // m^3/s

// Default gui parameters
export const DEFAULT_GUI_PARAMETERS: IGUIParams = {
  [EGUIFolderNames.STORAGE_TANK]: {
    height: DEFAULT_TANK_HEIGHT,
    radius: DEFAULT_TANK_RADIUS,
    initialFluidTemperature: DEFAULT_INITIAL_FLUID_TEMPERATURE,
    fluidDensity: DEFAULT_FLUID_DENSITY / 1000,
    heatCapacityFluid: DEFAULT_SPECIFIC_HEAT_CAPACITY_FLUID,
    heatLossCoefficient: DEFAULT_TANK_HEAT_LOSS_COEFFICIENT,
  },
  [EGUIFolderNames.SOLAR_PANEL]: {
    width: DEFAULT_SOLAR_PANEL_WIDTH,
    height: DEFAULT_SOLAR_PANEL_HEIGHT,
    efficiency: DEFAULT_SOLAR_PANEL_EFFICIENCY,
    heatLossCoefficient: DEFAULT_SOLAR_PANEL_HEAT_LOSS_COEFFICIENT,
  },
  [EGUIFolderNames.PIPE]: {
    radius: DEFAULT_PIPE_RADIUS,
    heatLossCoefficient: DEFAULT_PIPE_HEAT_LOSS_COEFFICIENT,
  },
  [EGUIFolderNames.ENVIRONMENT]: {
    speed: DEFAULT_SPEED,
    ambientTemperature: DEFAULT_AMBIENT_TEMPERATURE,
  },
  [EGUIFolderNames.OTHER]: {
    heatmap: true,
  },
};
