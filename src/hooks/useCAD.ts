import { CAD } from 'src/helpers';
import { MutableRefObject, useEffect, useRef } from 'react';

/**
 * Hooks for cad
 */
export const useCAD = (): {
  cadContainerRef: MutableRefObject<HTMLDivElement | null>;
  cadInstanceRef: MutableRefObject<CAD | null>;
} => {
  const cadContainerRef = useRef<HTMLDivElement | null>(null);
  const cadInstanceRef = useRef<CAD | null>(null);

  // Initialize renderer context here
  useEffect(() => {
    if (cadInstanceRef.current || !cadContainerRef.current) return;

    const cadInstance = new CAD(cadContainerRef.current);
    cadInstance.init();
    cadInstanceRef.current = cadInstance;

    return () => {
      cadInstance.dispose();
      cadInstanceRef.current = null;
    };
  }, []);

  return { cadContainerRef, cadInstanceRef };
};
