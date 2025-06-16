import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { NavLink } from 'react-router';
import { useFigma } from '../../hooks/useFigma';

export function Home() {
  const { recursicaVariables } = useFigma();
  return (
    <Flex
      direction={'column'}
      justify={'center'}
      align={'center'}
      gap={'size/spacer/default'}
      style={{ height: '100%' }}
    >
      <Flex direction='column' align='center' gap={'size/spacer/0-5x'}>
        <Logo />
        <Typography variant='h2'>{recursicaVariables ? 'Recursica' : 'Loading...'}</Typography>
      </Flex>
      <Button
        component={NavLink}
        loading={!recursicaVariables}
        to='/recursica/token'
        label='Get started'
      />
    </Flex>
  );
}
