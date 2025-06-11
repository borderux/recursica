import { Anchor as ManAnchor, AnchorProps as ManAnchorProps } from '@mantine/core';
import { PropsWithChildren } from 'react';
import { OmitStyles } from '@/ui-kit/utils';

export interface AnchorProps extends OmitStyles<ManAnchorProps>, PropsWithChildren {
  href: string;
  download: string;
}

export function Anchor({ children, ...props }: AnchorProps) {
  return <ManAnchor {...props}>{children}</ManAnchor>;
}
