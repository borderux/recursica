import { Anchor, Button, Flex, Typography } from '@recursica/ui-kit';
import { useRepository } from '../../hooks/useRepository';

export function Success() {
  const { selectedProject, prLink } = useRepository();
  return (
    <Flex direction='column'>
      <Typography variant='h6'>Success</Typography>
      <Typography variant='body-1/normal'>{selectedProject?.name}</Typography>
      {prLink && (
        <Button
          text={false}
          leftSection={'open_in_new_Outlined'}
          label='Open pull request'
          component={Anchor}
          href={prLink}
          target='_blank'
          rel='noopener noreferrer'
        />
      )}
    </Flex>
  );
}
