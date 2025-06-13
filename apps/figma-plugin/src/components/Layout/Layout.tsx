import { Flex, Button, Logo } from '@recursica/ui-kit';
import { Outlet, useNavigate } from 'react-router';

export function Layout() {
  const navigate = useNavigate();
  return (
    <Flex direction={'column'} h='100vh'>
      <Flex flex={1} justify='center' align='center'>
        <Outlet />
      </Flex>
      <Flex
        px={8}
        align='center'
        justify='space-between'
        border={{
          top: '1px solid',
        }}
        borderColor={{
          top: 'color/stroke/default',
        }}
      >
        <Button
          size='small'
          variant='text'
          leftSection='arrow_back_ios_new_Outlined'
          onClick={() => navigate(-1)}
          label='Back'
        />
        <Logo size='small' />
      </Flex>
    </Flex>
  );
}
