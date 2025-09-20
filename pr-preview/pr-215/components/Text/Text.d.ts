import { OmitStyles } from '../../utils';
import { TextProps as ManTextProps } from '@mantine/core';
import { PropsWithChildren } from '../../../../../node_modules/react';
export interface TextProps extends OmitStyles<ManTextProps>, PropsWithChildren {
}
export declare function Text({ children, ...props }: TextProps): import("react/jsx-runtime").JSX.Element;
