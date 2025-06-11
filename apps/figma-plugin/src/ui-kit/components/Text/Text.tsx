import { OmitStyles } from '@/ui-kit/utils';
import { Text as ManText, TextProps as ManTextProps } from '@mantine/core';
import { PropsWithChildren } from 'react';

export interface TextProps extends OmitStyles<ManTextProps>, PropsWithChildren {}

export function Text({ children, ...props }: TextProps): JSX.Element {
  return <ManText {...props}>{children}</ManText>;
}
