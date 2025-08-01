import { Flex } from '@recursica/ui-kit-mantine';
import { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{
  footer?: React.ReactNode;
  header?: React.ReactNode;
}>;

export function Layout({ children, footer, header }: LayoutProps) {
  return (
    <Flex
      direction={'column'}
      justify={'center'}
      align={'center'}
      gap={10}
      h={'100%'}
      py={16}
      px={24}
    >
      {header}
      <Flex flex={1} direction='column' justify='center' gap={10} w='100%'>
        {children}
      </Flex>
      {footer}
    </Flex>
  );
}
