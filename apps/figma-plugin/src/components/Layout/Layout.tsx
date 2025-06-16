import { Flex, Button, Logo } from '@recursica/ui-kit';
import { Outlet, useNavigate } from 'react-router';

export function Layout() {
  const navigate = useNavigate();
  return (
    <Flex direction={'column'}>
      <Flex flex={1} justify='center' align='center'>
        <Outlet />
      </Flex>
      <Flex
        px={'size/spacer/default'}
        align='center'
        justify='space-between'
        btw='1px'
        bts='solid'
        btc='color/stroke/default'
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
