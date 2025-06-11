import { Flex, Typography, Button } from '@/ui-kit';
import { NavLink } from 'react-router';

export function Home() {
  return (
    <Flex direction={'column'} justify={'center'} align={'center'} gap={20}>
      <Typography>Home</Typography>
      <Button component={NavLink} to='/figma/select-sources' label='Get Started' />
    </Flex>
  );
}
