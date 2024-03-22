import React from 'react';
import { useSimulator } from 'src/hooks';

export const LandingPage = () => {
  const { simulatorContainerRef } = useSimulator();

  return <div ref={simulatorContainerRef} className="h-full w-full"></div>;
};
