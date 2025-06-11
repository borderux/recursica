import { Divider as ManDivider, DividerProps as ManDividerProps } from '@mantine/core';
import { OmitStyles } from '@/ui-kit/utils';

export interface DividerProps extends OmitStyles<ManDividerProps> {}

export function Divider(props: DividerProps): JSX.Element {
  return <ManDivider {...props} />;
}
