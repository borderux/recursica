import { OmitStyles } from '@/ui-kit/utils';
import { Box as ManBox, BoxProps as ManBoxProps } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface BoxProps extends OmitStyles<ManBoxProps>, PropsWithChildren {}

export function Box({ children, ...props }: BoxProps): JSX.Element {
  return <ManBox {...props}>{children}</ManBox>;
}
