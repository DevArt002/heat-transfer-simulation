import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { Simulator } from 'src/helpers';

/**
 * Hooks for simulator
 */
export const useSimulator = (): {
  simulatorContainerRef: MutableRefObject<HTMLDivElement | null>;
  simulatorInstance: Simulator | null;
} => {
  const simulatorContainerRef = useRef<HTMLDivElement | null>(null);
  const [simulatorInstance, setSimulatorInstance] = useState<Simulator | null>(null);

  // Initialize renderer context here
  useEffect(() => {
    if (!simulatorContainerRef.current) return;

    const simulatorInstance = new Simulator(simulatorContainerRef.current);
    simulatorInstance.init();
    setSimulatorInstance(simulatorInstance);

    return () => {
      simulatorInstance.dispose();
    };
  }, []);

  return { simulatorContainerRef, simulatorInstance };
};
