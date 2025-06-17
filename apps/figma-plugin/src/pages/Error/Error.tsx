import { Chip, Flex, Typography } from '@recursica/ui-kit';
import { useRepository } from '../../hooks/useRepository';

export function Error() {
  const { selectedProject } = useRepository();
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
      <Typography variant='body-1/normal' color='color-on/surface/alert'>
        Dang! We ran into errors.
      </Typography>
    </Flex>
  );
}
