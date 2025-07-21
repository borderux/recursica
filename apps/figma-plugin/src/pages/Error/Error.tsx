import { Flex, Typography, Button } from '@recursica/ui-kit';
import { NavLink } from 'react-router';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';

export function Error() {
  const { error } = useFigma();

  const getErrorMessage = () => {
    switch (error) {
      case 'NO_TOKENS_FOUND':
        return 'There are no libraries added yet, make sure to connect them before initializing the repo.';
      case 'NO_TOKENS_OR_THEMES_FOUND':
        return 'It seems like themes or tokens library are missing, make sure you add them and connect them before initializing the repo.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <Layout
      footer={
        <Button
          component={NavLink}
          to='https://recursica.com'
          target='_blank'
          rel='noopener noreferrer'
          label='Learn more'
        />
      }
    >
      <Flex direction='column' gap={16}>
        <Typography
          variant='body-1/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
        >
          {getErrorMessage()}
        </Typography>

        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-0/elements/text/color'
          opacity={0.84}
        >
          Already added it? Try closing and opening your file.
        </Typography>
      </Flex>
    </Layout>
  );
}
