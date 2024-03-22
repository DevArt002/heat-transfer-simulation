import { ChartVisualizer } from 'src/components';
import React from 'react';
import { useSimulator } from 'src/hooks';

export const LandingPage = () => {
  const { simulatorContainerRef, simulatorInstance } = useSimulator();

  return (
    <div className="relative h-full w-full">
      {/* 3D Renderer */}
      <div ref={simulatorContainerRef} className="h-full w-full"></div>
      {/* Chat view */}
      <ChartVisualizer simulatorInstance={simulatorInstance} />
    </div>
  );
};
