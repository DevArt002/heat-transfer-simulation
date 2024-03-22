import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { ESimulatorEvents } from 'src/types';
import type { Simulator } from 'src/helpers';
import { Visualizer } from 'src/helpers';

/**
 * Hooks for visualizer
 */
export const useVisualizer = (
  simulatorInstance: Simulator | null,
): {
  visualizerContainerRef: MutableRefObject<HTMLDivElement | null>;
  visualizerInstance: Visualizer | null;
} => {
  const visualizerContainerRef = useRef<HTMLDivElement | null>(null);
  const [visualizerInstance, setVisualizerInstance] = useState<Visualizer | null>(null);

  // Initialize plot instance
  useEffect(() => {
    if (visualizerContainerRef.current === null) return;

    const visualizerInstance = new Visualizer(visualizerContainerRef.current);
    visualizerInstance.init();
    setVisualizerInstance(visualizerInstance);

    return () => {
      visualizerInstance.dispose();
    };
  }, []);

  // Add event listeners
  useEffect(() => {
    if (simulatorInstance === null || visualizerInstance === null) return;

    const { simulationSystem } = simulatorInstance;

    if (simulationSystem === null) return;

    simulationSystem.addEventListener(
      ESimulatorEvents.DATA_UPDATED,
      visualizerInstance.onSimulationDataUpdated,
    );
    simulationSystem.addEventListener(
      ESimulatorEvents.STARTED,
      visualizerInstance.onSimulationStarted,
    );
    simulationSystem.addEventListener(
      ESimulatorEvents.STOPPED,
      visualizerInstance.onSimulationStopped,
    );

    return () => {
      simulationSystem.removeEventListener(
        ESimulatorEvents.DATA_UPDATED,
        visualizerInstance.onSimulationDataUpdated,
      );
      simulationSystem.removeEventListener(
        ESimulatorEvents.STARTED,
        visualizerInstance.onSimulationStarted,
      );
      simulationSystem.removeEventListener(
        ESimulatorEvents.STOPPED,
        visualizerInstance.onSimulationStopped,
      );
    };
  }, [simulatorInstance, visualizerInstance]);

  return { visualizerContainerRef, visualizerInstance };
};
