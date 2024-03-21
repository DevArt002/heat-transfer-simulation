import React, { FC, HTMLAttributes, memo } from 'react';

import { LoadingIcon } from 'src/components';
import clsx from 'clsx';

interface ILoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {}

export const LoadingSpinner: FC<ILoadingSpinnerProps> = memo(({ className, style, ...rest }) => {
  return (
    <div
      className={clsx('flex h-full w-full items-center justify-center', className)}
      style={style}
      {...rest}>
      <LoadingIcon className="animate-spin text-white" width={100} height={100} />
    </div>
  );
});
