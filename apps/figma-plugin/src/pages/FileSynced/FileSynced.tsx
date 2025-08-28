import { Flex, Typography, Icon, Button } from '@recursica/ui-kit-mantine';
import { useFigma } from '../../hooks/useFigma';
import { Layout } from '../../components';
import { useMemo } from 'react';
import { NavLink } from 'react-router';

export function FileSynced() {
  const { repository, filetype } = useFigma();

  const getNextStepTitle = useMemo(() => {
    if (filetype === 'tokens') {
      return 'All done here';
    }
    if (filetype === 'themes') {
      return 'Nice! Move on from here.';
    }
    if (filetype === 'icons' || filetype === 'ui-kit') {
      return 'If you’re a designer, your work is done here';
    }
    return 'You can now close the plugin and continue';
  }, [filetype]);

  const getNextStepDescription = useMemo(() => {
    if (filetype === 'tokens') {
      return (
        <>
          Finally, go to <b>#2 Brand file</b> file and run the plugin once more
        </>
      );
    }
    if (filetype === 'themes') {
      return (
        <>
          Finally, go to <b>#4 UI kit file</b> file and run the plugin once more
        </>
      );
    }
    if (filetype === 'icons' || filetype === 'ui-kit') {
      return 'Feeling brave? Connect a repo';
    }
    return 'You can now close the plugin and continue';
  }, [filetype]);

  const target = useMemo(() => {
    if (repository && repository.platform && repository.accessToken) {
      return '/publish';
    }
    return '/auth';
  }, [repository]);

  return (
    <Layout
      header='default'
      footer={
        (filetype === 'icons' || filetype === 'ui-kit') && (
          <Button
            disabled={!filetype}
            component={NavLink}
            to={target}
            label='Connect Git repository'
          />
        )
      }
    >
      <Flex direction='column' align='center' justify='center' gap={16}>
        <Icon name='check_circle_outline' color='layers/layer-1/elements/success-text' />
        <Typography variant='h6' textAlign='center' color='layers/layer-1/elements/success-text'>
          {getNextStepTitle}
        </Typography>
        <Typography
          variant='body-2/normal'
          textAlign='center'
          color='layers/layer-1/elements/success-text'
        >
          {getNextStepDescription}
        </Typography>
      </Flex>
    </Layout>
  );
}
