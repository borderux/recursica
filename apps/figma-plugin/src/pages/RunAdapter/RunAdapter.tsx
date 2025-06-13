import { useRepository } from '../../hooks/useRepository';
import { Flex, Button, Typography } from '@recursica/ui-kit';
import { NavLink } from 'react-router';

export function RunAdapter() {
  const { adapterResponse, publishFiles } = useRepository();

  return (
    <Flex direction='column' gap={16}>
      <Typography>{adapterResponse}</Typography>
      {adapterResponse && (
        <Button
          component={NavLink}
          to='/recursica/publish-files'
          label='Publish Files'
          onClick={() => publishFiles()}
        />
      )}
    </Flex>
  );
}
