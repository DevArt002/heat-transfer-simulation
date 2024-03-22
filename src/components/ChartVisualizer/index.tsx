import { ESimulatorEvents, ISimulatorPumpLogPayload } from 'src/types';
import React, { FC, useCallback, useEffect, useState } from 'react';

import type { Simulator } from 'src/helpers';
import classNames from 'classnames';
import { useToggle } from 'src/hooks';
import { useVisualizer } from 'src/hooks/useVisualizer';

interface IChartVisualizer {
  simulatorInstance: Simulator | null;
}

export const ChartVisualizer: FC<IChartVisualizer> = ({ simulatorInstance }) => {
  const { visualizerContainerRef } = useVisualizer(simulatorInstance);
  const [started, { toggle: toggleStarted }] = useToggle(false);
  const [collapsed, { toggle: toggleCollapsed }] = useToggle(false);
  const [logs, setLogs] = useState<ISimulatorPumpLogPayload[]>([]);

  // Handle start
  const handleStart = useCallback(() => {
    try {
      if (simulatorInstance === null) {
        throw new Error('3D simulator is not initialized');
      }

      if (started) {
        simulatorInstance.stopSimulation();
      } else {
        simulatorInstance.startSimulation();
        setLogs([]);
      }
    } catch (error) {
      console.error(error);
    }

    toggleStarted();
  }, [simulatorInstance, started, toggleStarted]);

  // Listener when pump log is changed
  const onLogRecieved = useCallback((e: Event) => {
    setLogs((cur) => [...cur, (e as CustomEvent<ISimulatorPumpLogPayload>).detail]);
  }, []);

  // Add event listeners
  useEffect(() => {
    if (simulatorInstance === null) return;

    const { simulationSystem } = simulatorInstance;

    if (simulationSystem === null) return;

    simulationSystem.addEventListener(ESimulatorEvents.PUMP_STATUS_UPDATED, onLogRecieved);

    return () => {
      simulationSystem.removeEventListener(ESimulatorEvents.PUMP_STATUS_UPDATED, onLogRecieved);
    };
  }, [simulatorInstance, onLogRecieved]);

  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-2 bg-gray-400 p-2">
      {/* Action buttons */}
      <div className="flex w-full justify-end gap-2 text-xs text-white">
        <button className="w-20 rounded bg-blue-400 p-1" onClick={handleStart}>
          {started ? 'Stop' : 'Start'}
        </button>
        <button className="w-20 rounded bg-blue-400 p-1" onClick={toggleCollapsed}>
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      {/* Viz sections */}
      <div className={classNames('flex-grow transition-all', collapsed ? 'h-0' : 'h-80')}>
        {/* Chart container */}
        <div ref={visualizerContainerRef} className="h-1/2 w-full" />
        {/* Pump logs */}
        <div className="flex h-1/2 w-full flex-col gap-1 overflow-y-scroll bg-white p-2">
          {logs.map(({ message, status }, index) => (
            <p
              key={`pump-log-${index}`}
              className={classNames(
                'w-full',
                status === 'on' ? 'text-blue-600' : 'text-yellow-600',
              )}>
              {message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
