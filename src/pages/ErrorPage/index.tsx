import React, { FC } from 'react';
import { FallbackProps as IErrorProps } from 'react-error-boundary';

export const ErrorPage: FC<IErrorProps> = ({ error }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="mb-4 text-xl">Something went wrong</p>
      <p className="text-base">{error.message}</p>
    </div>
  );
};
