import { Box, Flex, FlexProps, Logo, Typography } from '@recursica/ui-kit-mantine';
import { PropsWithChildren } from 'react';
import { useFigma } from '../../hooks';

type LayoutProps = PropsWithChildren<{
  header?: React.ReactNode | 'default';
  footer?: React.ReactNode;
  wrapperProps?: FlexProps;
}>;

export function Layout({ children, footer, header, wrapperProps }: LayoutProps) {
  const { pluginVersion } = useFigma();
  const SHOW_VERSION_BANNER = import.meta.env.VITE_SHOW_VERSION_BANNER === 'true';

  return (
    <Flex
      direction={'column'}
      justify={'center'}
      align={'center'}
      gap={'size/spacer/3x'}
      h={'100%'}
      py={16}
      px={24}
    >
      {header === 'default' ? (
        <Flex direction='row' w='100%' gap={'size/spacer/1-5x'}>
          <Logo size='small' />
          <Typography variant='body-1/strong' color='layers/layer-1/elements/text/color'>
            Recursica
          </Typography>
        </Flex>
      ) : (
        header
      )}
      <Flex flex={1} direction='column' justify='center' gap={10} w='100%' {...wrapperProps}>
        {children}
      </Flex>
      {footer}
      <Box style={{ position: 'absolute', bottom: 4, right: 4 }}>
        <Typography variant='caption' color='layers/layer-0/elements/text/color' opacity={0.84}>
          {SHOW_VERSION_BANNER ? `TEST v${pluginVersion}` : pluginVersion}
        </Typography>
      </Box>
    </Flex>
  );
}
