import { Flex, FlexProps, Logo, Typography } from '@recursica/ui-kit-mantine';
import { PropsWithChildren } from 'react';
import { useFigma } from '../../hooks';
import { useNavigate } from 'react-router';

type LayoutProps = PropsWithChildren<{
  header?: React.ReactNode | 'default';
  footer?: React.ReactNode;
  wrapperProps?: FlexProps;
}>;

export function Layout({ children, footer, header, wrapperProps }: LayoutProps) {
  const { pluginVersion } = useFigma();
  const navigate = useNavigate();
  const pluginMode = import.meta.env.VITE_PLUGIN_MODE;

  const handleVersionClick = () => {
    console.log('[Layout] Version clicked, clearing sync metadata');
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CLEAR_SYNC_METADATA',
        },
        pluginId: '*',
      },
      '*'
    );
    navigate('/home');
  };

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
      <div
        style={{ position: 'absolute', bottom: 4, right: 4, cursor: 'pointer' }}
        onClick={handleVersionClick}
      >
        <Typography variant='caption' color='layers/layer-0/elements/text/color' opacity={0.84}>
          {pluginMode === 'test' ? `TEST v${pluginVersion}` : pluginVersion}
        </Typography>
      </div>
    </Flex>
  );
}
