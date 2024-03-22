import { ESimulatorEvents, ISimulatorDataUpdatedPayload } from 'src/types';
import { calculateSolarRadiation, formatSeconds } from 'src/utils';

import { Simulator } from 'src/helpers';
import { System } from './system';

export class SimulationSystem extends System {
  private _totalEnergyProduced: number = 0;
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
      const { pumpEntity, guiSystem } = this._simulator;

      if (pumpEntity === null || guiSystem === null) {
        throw new Error('Not ready for simulation');
      }

      // Start pump
      pumpEntity.start();

      // Dispatch event
      this.dispatchEvent(new CustomEvent(ESimulatorEvents.PUMP_RUNNING, { detail: true }));

      // Disable gui
      guiSystem.enable(false);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Stop
   */
  stop(): void {
    try {
      const { pumpEntity, guiSystem } = this._simulator;

      if (pumpEntity === null || guiSystem === null) {
        throw new Error('Not ready for simulation');
      }

      // Stop pump
      pumpEntity.stop();

      // Dispatch event
      this.dispatchEvent(new CustomEvent(ESimulatorEvents.PUMP_RUNNING, { detail: false }));

      // Enable gui
      guiSystem.enable(true);

      this._totalEnergyProduced = 0;
      this._totalEnergyLost = 0;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Calculate energy in
   */
  _calculateEnergyIn(delta: number, elapsed: number): number {
    const {
      _simulator: { solarPanelEntity, environmentEntity },
    } = this;

    if (solarPanelEntity === null || environmentEntity === null) return 0;

    // Calculate solar radiation by time and latitude
    const solarRadiation = calculateSolarRadiation(elapsed, environmentEntity.latitude);
    // Calculate energy gained by water from solar panel
    const energyIn = solarPanelEntity.efficiencySurface * solarRadiation * delta;

    return energyIn;
  }

  /**
   * Calculate energy out
   */
  _calculateEnergyOut(delta: number): number {
    const {
      _simulator: { storageTankEntity, pipeEntity, pumpEntity, solarPanelEntity },
    } = this;

    if (
      storageTankEntity === null ||
      pipeEntity === null ||
      pumpEntity === null ||
      solarPanelEntity === null
    )
      return 0;

    let energyOutRate = storageTankEntity.energyOutRate;

    // If pump is running, need to add energy loss on solar panel and pipe
    // TODO perhaps, need to involve energy loss on pump too
    if (pumpEntity.isRunning) {
      energyOutRate += pipeEntity.energyOutRate + solarPanelEntity.energyOutRate;
    }

    const energyOut = energyOutRate * delta;

    return energyOut;
  }

  /**
   * Update temperature
   */
  _updateTemp(delta: number, elapsed: number): void {
    const {
      _simulator: { storageTankEntity, pumpEntity },
    } = this;

    if (storageTankEntity === null || pumpEntity === null) return;

    const { heatCapacityFluid, fluidMass } = storageTankEntity;

    const energyIn = this._calculateEnergyIn(delta, elapsed);
    const energyOut = this._calculateEnergyOut(delta);

    // Perform temperate update only when pump is running
    if (pumpEntity.isRunning) {
      // Update total energies
      this._totalEnergyProduced += energyIn;
      this._totalEnergyLost += energyOut;

      // Calculate change in temperature
      const deltaTemp = (energyIn - energyOut) / (fluidMass * heatCapacityFluid);

      storageTankEntity.fluidTemp += deltaTemp;
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent<ISimulatorDataUpdatedPayload>(ESimulatorEvents.DATA_UPDATED, {
        detail: { elapsed, temperature: storageTankEntity.fluidTemp },
      }),
    );

    // // Log temperature and energies
    // console.log(
    //   `Hour ${formatSeconds(elapsed)}: Fluid temperature: ${storageTankEntity.fluidTemp.toFixed(
    //     2,
    //   )}°C`,
    // );
    // console.log(
    //   `Energy produced: ${energyIn.toFixed(2)} J, Energy lost: ${energyOut.toFixed(2)} J`,
    // );
  }

  /**
   * Update
   */
  update(delta: number, elapsed: number): void {
    const { environmentEntity } = this._simulator;

    if (environmentEntity === null) return;

    const { speed } = environmentEntity;

    // Get real elapsed, delta times by multiplying speed factor
    const realElapsed = elapsed * speed;
    const realDelta = delta * speed;

    // Update temperature
    this._updateTemp(realDelta, realElapsed);
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.stop();
  }
}
