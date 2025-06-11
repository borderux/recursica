import { OmitStyles } from '@/ui-kit/utils';
import { Loader as ManLoader, LoaderProps as ManLoaderProps } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface LoaderProps extends OmitStyles<ManLoaderProps>, PropsWithChildren {}

export function Loader({ children, ...props }: LoaderProps): JSX.Element {
  return <ManLoader {...props}>{children}</ManLoader>;
}
