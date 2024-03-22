import { Simulator } from 'src/helpers';
import { MutableRefObject, useEffect, useRef } from 'react';

/**
 * Hooks for simulator
 */
export const useSimulator = (): {
  simulatorContainerRef: MutableRefObject<HTMLDivElement | null>;
  simulatorInstanceRef: MutableRefObject<Simulator | null>;
} => {
  const simulatorContainerRef = useRef<HTMLDivElement | null>(null);
  const simulatorInstanceRef = useRef<Simulator | null>(null);

  // Initialize renderer context here
  useEffect(() => {
    if (simulatorInstanceRef.current || !simulatorContainerRef.current) return;

    const simulatorInstance = new Simulator(simulatorContainerRef.current);
    simulatorInstance.init();
    simulatorInstanceRef.current = simulatorInstance;

    return () => {
      simulatorInstance.dispose();
      simulatorInstanceRef.current = null;
    };
  }, []);

  return { simulatorContainerRef, simulatorInstanceRef };
};
