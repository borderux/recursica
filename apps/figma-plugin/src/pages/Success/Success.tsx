import { Anchor, Button, Chip, Flex, Typography } from '@recursica/ui-kit';
import { useRepository } from '../../hooks/useRepository';

export function Success() {
  const { selectedProject, prLink } = useRepository();
  return (
    <Flex direction='column' gap={16} align='center'>
      {selectedProject && (
        <Chip
          icon={{
            unselected: 'favorite_Filled',
            selected: 'favorite_Filled',
          }}
          label={`${selectedProject.owner.name}/${selectedProject.name}`}
        />
      )}
      <Typography variant='body-1/normal' color='color/success/default'>
        Success
      </Typography>
      {prLink && (
        <Button
          text={false}
          variant='text'
          color='button/color/text-enabled-default'
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
