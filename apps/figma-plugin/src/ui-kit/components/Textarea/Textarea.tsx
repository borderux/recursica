import { Textarea as ManTextarea, TextareaProps as ManTextareaProps } from '@mantine/core';
import styles from './Textarea.styles.module.scss';
import { OmitStyles } from '@/ui-kit/utils';

export interface TextareaProps extends OmitStyles<ManTextareaProps> {}

export function Textarea({ children, ...props }: TextareaProps) {
  return (
    <ManTextarea
      classNames={{
        input: styles.textarea,
        wrapper: styles.wrapper,
        root: styles.root,
        label: styles.label,
      }}
      {...props}
    >
      {children}
    </ManTextarea>
  );
}
