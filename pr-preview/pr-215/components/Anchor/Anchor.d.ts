import { AnchorProps as ManAnchorProps } from '@mantine/core';
import { PropsWithChildren } from '../../../../../node_modules/react';
import { OmitStyles } from '../../utils';
export interface AnchorProps extends OmitStyles<ManAnchorProps>, PropsWithChildren {
    href: string;
    target?: string;
    rel?: string;
    download?: string;
}
export declare function Anchor({ children, ...props }: AnchorProps): import("react/jsx-runtime").JSX.Element;
