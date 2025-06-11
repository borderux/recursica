import { Flex, Button } from '@/ui-kit';
import { NavLink, Outlet, useNavigate } from 'react-router';

export function Layout() {
  const navigate = useNavigate();
  return (
    <Flex direction={'column'} h='100vh'>
      <Flex p='md' gap='md'>
        <NavLink to='/home'>Home</NavLink>
        <Button onClick={() => navigate(-1)} label='Back' />
      </Flex>
      <Outlet />
    </Flex>
  );
}
