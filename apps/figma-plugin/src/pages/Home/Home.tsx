import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { NavLink } from 'react-router';
import { useFigma } from '../../hooks/useFigma';

export function Home() {
  const { loading } = useFigma();
  return (
    <Flex
      direction={'column'}
      justify={'center'}
      align={'center'}
      gap={24}
      h={'100%'}
      py={16}
      px={24}
    >
      <Flex direction='column' align='center' gap={4}>
        <Logo />
        <Typography variant='h2'>{loading ? 'Loading...' : 'Recursica'}</Typography>
      </Flex>
      <Button component={NavLink} loading={loading} to='/recursica/token' label='Get started' />
    </Flex>
  );
}
