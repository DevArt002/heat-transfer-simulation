import React, { FC, useCallback } from 'react';

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
      }
    } catch (error) {
      console.error(error);
    }

    toggleStarted();
  }, [simulatorInstance, started, toggleStarted]);

  return (
    <div className="absolute bottom-0 flex w-full flex-col gap-1 bg-gray-400 p-2">
      {/* Action buttons */}
      <div className="flex w-full justify-end gap-2 text-xs text-white">
        <button className="w-20 rounded bg-blue-400 p-1" onClick={handleStart}>
          {started ? 'Stop' : 'Start'}
        </button>
        <button className="w-20 rounded bg-blue-400 p-1" onClick={toggleCollapsed}>
          {collapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      {/* Chart container */}
      <div
        ref={visualizerContainerRef}
        className={classNames('w-full flex-grow transition-all', collapsed ? 'h-0' : 'h-80')}
      />
    </div>
  );
};
