import { Box, Flex, Typography } from '@recursica/ui-kit-mantine';
import { PropsWithChildren } from 'react';
import { useFigma } from '../../hooks';

type LayoutProps = PropsWithChildren<{
  footer?: React.ReactNode;
  header?: React.ReactNode;
}>;

export function Layout({ children, footer, header }: LayoutProps) {
  const { pluginVersion } = useFigma();
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
      <Box style={{ position: 'absolute', bottom: 4, right: 4 }}>
        <Typography variant='caption' color='layers/layer-0/elements/text/color' opacity={0.84}>
          {pluginVersion}
        </Typography>
      </Box>
    </Flex>
  );
}
