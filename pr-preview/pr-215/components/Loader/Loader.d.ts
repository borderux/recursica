import { OmitStyles } from '../../utils';
import { LoaderProps as ManLoaderProps } from '@mantine/core';
import { PropsWithChildren } from '../../../../../node_modules/react';
export interface LoaderProps extends OmitStyles<ManLoaderProps>, PropsWithChildren {
}
export declare function Loader({ children, ...props }: LoaderProps): import("react/jsx-runtime").JSX.Element;
