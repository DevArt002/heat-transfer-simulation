import { calculateSolarRadiation, formatMS } from 'src/utils';

import { Simulator } from 'src/helpers';
import { System } from './system';

export class SimulationSystem extends System {
  // Attributes from other entities
  private _speed: number = 0; // Factor defining how fast time is flowing
  private _latitude: number = 0; // Latitude of location
  private _ambientTemperature: number = 0; // Ambient temperature
  private _volumeFluid: number = 0; // m^3 Assuming the tank is filled with fluid.
  private _massFluid: number = 0; // Mass of fluid filled the tank.
  private _initialFluidTemperature: number = 0; // Initial temperature of fluid
  private _specificHeatCapacityFluid: number = 0; // Joules per gram per degree Celsius, e.g. water
  private _solarPanelArea: number = 0; // m^2 surface area of solar panel
  private _solarPanelEfficiency: number = 0; // Efficiency of solar panel
  private _solarPanelHeatLossCoefficient = 0; // Watts per square meter per degree Celsius

  // Temporary attributes
  private _currentFluidTemperature: number = 0;
  private _totalEnergyProduced: number = 0;
  private _totalEnergyRequired: number = 0;
  private _totalEnergyLost: number = 0;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  /**
   * Initialize
   */
  init(): void {}

  /**
   * Start
   */
  start(): void {
    try {
      const { environmentEntity, storageTankEntity, solarPanelEntity, pumpEntity } =
        this._simulator;

      if (
        environmentEntity === null ||
        storageTankEntity === null ||
        solarPanelEntity === null ||
        pumpEntity === null
      ) {
        throw new Error('Some entities are not initialized');
      }

      this._speed = environmentEntity.speed;
      this._latitude = environmentEntity.latitude;
      this._ambientTemperature = environmentEntity.ambientTemperature;
      this._volumeFluid = storageTankEntity.volume;
      this._massFluid = storageTankEntity.massFluid;
      this._specificHeatCapacityFluid = storageTankEntity.specificHeatCapacityFluid;
      this._initialFluidTemperature = storageTankEntity.initialFluidTemperature;
      this._solarPanelArea = solarPanelEntity.area;
      this._solarPanelEfficiency = solarPanelEntity.efficiency;
      this._solarPanelHeatLossCoefficient = solarPanelEntity.heatLoosCoefficient;

      this._currentFluidTemperature = this._initialFluidTemperature;

      pumpEntity.start();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Stop
   */
  stop(): void {
    const { pumpEntity } = this._simulator;

    if (pumpEntity === null) return;

    pumpEntity.stop();

    this._speed = 0;
    this._latitude = 0;
    this._ambientTemperature = 0;
    this._volumeFluid = 0;
    this._massFluid = 0;
    this._specificHeatCapacityFluid = 0;
    this._initialFluidTemperature = 0;
    this._solarPanelArea = 0;
    this._solarPanelEfficiency = 0;
    this._solarPanelHeatLossCoefficient = 0;
    this._currentFluidTemperature = 0;
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    const {
      _simulator,
      _speed,
      _latitude,
      _ambientTemperature,
      _massFluid,
      _specificHeatCapacityFluid,
      _solarPanelArea,
      _solarPanelEfficiency,
      _solarPanelHeatLossCoefficient,
    } = this;
    const { pumpEntity } = _simulator;

    // Without pump don't run simulation
    if (pumpEntity === null) return;

    // Pump is not running? abort here
    if (!pumpEntity.isStarted) return;

    const bakedElapsed = elapsed * _speed;
    const bakedDelta = delta * _speed;
    const solarRadiation = calculateSolarRadiation(bakedElapsed, _latitude);

    // Calculate energy gained by water from solar panel
    const energyIn = _solarPanelArea * solarRadiation * _solarPanelEfficiency * bakedDelta;

    // Calculate energy lost due to heat loss
    let energyOut =
      _solarPanelHeatLossCoefficient *
      _solarPanelArea *
      (this._currentFluidTemperature - _ambientTemperature) *
      bakedDelta;

    // Update total energies
    this._totalEnergyProduced += energyIn;
    this._totalEnergyLost += energyOut;

    // Calculate change in temperature
    const deltaT = (energyIn - energyOut) / (_massFluid * _specificHeatCapacityFluid);

    // Update temperature
    this._currentFluidTemperature += deltaT;

    // Calculate energy required to heat water (if temperature decrease, energy required is negative)
    const energyRequired = -deltaT * _massFluid * _specificHeatCapacityFluid;
    this._totalEnergyRequired += Math.max(0, energyRequired); // Only consider positive energy required

    // // Log temperature and energies
    // console.log(
    //   `Hour ${formatMS(bakedElapsed)}: Fluid temperature: ${this._currentFluidTemperature.toFixed(
    //     2,
    //   )}°C`,
    // );
    // console.log(
    //   `Energy produced: ${energyIn.toFixed(2)} J, Energy lost: ${energyOut.toFixed(2)} J`,
    // );
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.stop();
  }
}
