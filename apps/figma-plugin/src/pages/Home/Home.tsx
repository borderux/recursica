import { Flex, Typography, Button, Logo } from '@recursica/ui-kit';
import { NavLink } from 'react-router';

export function Home() {
  return (
    <Flex direction={'column'} justify={'center'} align={'center'} gap={10} h='100%'>
      <Flex direction='column' align='center' gap={4}>
        <Logo />
        <Typography>Recursica</Typography>
      </Flex>
      <Button component={NavLink} to='/figma/fetch-variables' label='Get started' />
    </Flex>
  );
}
