import { Typography, Flex } from '@recursica/ui-kit';
import { useRepository } from '../../hooks/useRepository';

export function PublishFiles() {
  const { prLink } = useRepository();
  return (
    <Flex direction='column' gap={16}>
      <Typography>Publish Files</Typography>
      {prLink ? (
        <Typography>
          <a href={prLink} target='_blank' rel='noopener noreferrer'>
            {prLink}
          </a>
        </Typography>
      ) : (
        <Typography> Loading...</Typography>
      )}
    </Flex>
  );
}
