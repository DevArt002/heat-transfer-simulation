import React, { FC, SVGProps } from 'react';

const SvgComponent: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} {...props}>
      <path d="M12 4V2A10 10 0 002 12h2a8 8 0 018-8z" fill="currentColor" />
    </svg>
  );
};

export default SvgComponent;
