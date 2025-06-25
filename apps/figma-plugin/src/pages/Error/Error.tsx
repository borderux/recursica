import { Button, Chip, Flex, Typography, copyToClipboard, Tooltip } from '@recursica/ui-kit';
import { useRepository } from '../../hooks/useRepository';
import { useRef, useState } from 'react';

export function Error() {
  const { selectedProject } = useRepository();
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyErrorToClipboard = () => {
    copyToClipboard('lorem ipsum dolor sit amet', copyButtonRef).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

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

      <Tooltip label='Error copied to clipboard' opened={copied}>
        <Button
          ref={copyButtonRef}
          text={false}
          variant='text'
          color='button/color/text-enabled-default'
          leftSection={'content_copy_Outlined'}
          id={'copy-errors-to-clipboard'}
          label={'Copy errors to clipboard'}
          onClick={handleCopyErrorToClipboard}
        />
      </Tooltip>
    </Flex>
  );
}
