import React from 'react';
import { useCAD } from 'src/hooks';

export const LandingPage = () => {
  const { cadContainerRef } = useCAD();

  return <div ref={cadContainerRef} className="h-full w-full"></div>;
};
