import {
  ESimulatorEvents,
  ISimulatorDataUpdatedPayload,
  ISimulatorPumpLogPayload,
} from 'src/types';
import { EXPECTED_MAX_TEMPERATURE, EXPECTED_MIN_TEMPERATURE } from 'src/constants';
import { calculateSolarRadiation, formatSeconds } from 'src/utils';

import { Simulator } from 'src/helpers';
import { System } from './system';

export class SimulationSystem extends System {
  private _totalEnergyProduced: number = 0;
  private _totalEnergyLost: number = 0;
  private _isStarted: boolean = false;

  constructor(simulator: Simulator) {
    super(simulator);

    this.init();
  }

  // Getter of started status
  get isStarted(): boolean {
    return this._isStarted;
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

      this._isStarted = true;

      // Dispatch event
      this.dispatchEvent(new CustomEvent(ESimulatorEvents.STARTED));

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

      this._isStarted = false;

      // Dispatch event
      this.dispatchEvent(new CustomEvent(ESimulatorEvents.STOPPED));

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
  private _calculateEnergyIn(delta: number, elapsed: number): number {
    const {
      _simulator: { solarPanelEntity, environmentEntity },
    } = this;

    if (solarPanelEntity === null || environmentEntity === null) return 0;

    // Calculate solar radiation by time and latitude
    const solarRadiation = calculateSolarRadiation(elapsed, environmentEntity.latitude);
    // Calculate energy gained by water from solar panel
    const energyIn = solarPanelEntity.efficiencySurface * solarRadiation * (delta / 1000);

    return energyIn;
  }

  /**
   * Calculate energy out
   */
  private _calculateEnergyOut(delta: number): number {
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

    const energyOut = energyOutRate * (delta / 1000);

    return energyOut;
  }

  /**
   * Control pump
   */
  private _controlPump(deltaEnergy: number, elapsed: number): void {
    const {
      _simulator: { storageTankEntity, pumpEntity },
      _isStarted,
    } = this;

    // If entites are not ready or simulation is not started, abort here
    if (storageTankEntity === null || pumpEntity === null || !_isStarted) return;

    let reason: string | null = null;
    let status: 'on' | 'off' = 'off';

    const { fluidTemp } = storageTankEntity;

    // In case of simulation started, try to control pump running automatically
    // If energy generation is negative or temperature is too high, stop pump
    if (deltaEnergy <= 0 || fluidTemp >= EXPECTED_MAX_TEMPERATURE) {
      if (pumpEntity.isRunning) {
        pumpEntity.stop();
        reason =
          deltaEnergy <= 0
            ? 'Stopped pump because energy generation is negative'
            : 'Stopped pump because temperature is too high';
        status = 'off';
      }
    }

    // If energy generation is positve and temperature is low, start pump
    if (deltaEnergy > 0 && fluidTemp < EXPECTED_MIN_TEMPERATURE) {
      if (!pumpEntity.isRunning) {
        pumpEntity.start();
        reason = 'Started pump because energy generation is positive and temperature is low';
        status = 'on';
      }
    }

    if (reason) {
      // Dispatch event
      this.dispatchEvent(
        new CustomEvent<ISimulatorPumpLogPayload>(ESimulatorEvents.PUMP_STATUS_UPDATED, {
          detail: {
            message: `${formatSeconds(elapsed)}: 
              ${reason}: 
              ${deltaEnergy.toFixed(2)}J, 
              ${fluidTemp.toFixed(2)}°C`,
            status,
          },
        }),
      );
    }
  }

  /**
   * Update temperature
   */
  private _updateTemp(delta: number, elapsed: number): void {
    const {
      _simulator: { storageTankEntity, pumpEntity },
      _isStarted,
    } = this;

    // If entites are not ready or simulation is not started, abort here
    if (storageTankEntity === null || pumpEntity === null || !_isStarted) return;

    const { heatCapacityFluid, fluidMass } = storageTankEntity;

    let energyIn = this._calculateEnergyIn(delta, elapsed);
    const energyOut = this._calculateEnergyOut(delta);
    const deltaEnergy = energyIn - energyOut;

    // Update total energy lost
    this._totalEnergyLost += energyOut;

    // If pump is running, involve positive energy for temperature calcuation
    if (pumpEntity.isRunning) {
      // Update total energe produced
      this._totalEnergyProduced += energyIn;
    }
    // Otherwise, ignore positive energy since physically fluid is not flowing
    else {
      energyIn = 0;
    }

    // Calculate change in temperature
    const deltaTemp = (energyIn - energyOut) / (fluidMass * heatCapacityFluid);
    storageTankEntity.fluidTemp += deltaTemp;

    // Try turn on/off pump automatically
    this._controlPump(deltaEnergy, elapsed);

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent<ISimulatorDataUpdatedPayload>(ESimulatorEvents.DATA_UPDATED, {
        detail: { elapsed, temperature: storageTankEntity.fluidTemp },
      }),
    );
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
