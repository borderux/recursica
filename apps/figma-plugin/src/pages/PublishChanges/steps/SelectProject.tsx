import { useRepository } from '../../../hooks/useRepository';
import { useFigma } from '../../../hooks/useFigma';
import { NavLink, useNavigate } from 'react-router';
import { useEffect } from 'react';
import {
  Typography,
  Flex,
  Dropdown,
  Button,
  ComboboxItem,
  Box,
  IconName,
  Icon,
  Anchor,
} from '@recursica/ui-kit-mantine';
import { Layout } from '../../../components/Layout/Layout';

export const getPlatformIcon = (platform: string | undefined): IconName => {
  switch (platform?.toLowerCase()) {
    case 'github':
      return 'github_outline';
    case 'gitlab':
      return 'gitlab_outline';
    default:
      return 'arrow_left_end_on_rectangle_outline';
  }
};

function Header() {
  return (
    <Box w='100%'>
      <Typography textAlign='left' variant='body-1/strong'>
        Connect a Git repository
      </Typography>
    </Box>
  );
}

export function SelectProject() {
  const { userProjects, selectedProjectId, updateSelectedProjectId, refetchUserProjects } =
    useRepository();
  const { repository } = useFigma();
  const navigate = useNavigate();

  // Refetch projects every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUserProjects();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [refetchUserProjects]);

  const getPlatformDisplayName = (platform: string | undefined) => {
    switch (platform?.toLowerCase()) {
      case 'github':
        return 'GitHub';
      case 'gitlab':
        return 'GitLab';
      default:
        return 'repository';
    }
  };

  const handleContinue = () => {
    if (selectedProjectId) {
      navigate('/publish/home');
    }
  };

  if (userProjects.length === 0) {
    return (
      <Layout
        header={<Header />}
        footer={
          <Button
            variant='outline'
            label='Back'
            component={NavLink}
            to={'/auth'}
            leading='arrow_left_outline'
          />
        }
      >
        <Flex direction='column' align='center' gap={'size/spacer/2x'}>
          <Icon name='face_frown_outline' size={32} />
          <Typography variant='body-1/normal' textAlign='center'>
            It seems like you don&apos;t have a repository project yet.
          </Typography>
          <Flex direction='column' align='center' gap={'size/spacer/2x'}>
            <Typography
              variant='body-1/normal'
              textAlign='center'
              color='layers/layer-1/elements/interactive/color'
            >
              <Anchor
                href='https://recursica.slack.com/channels/help'
                target='_blank'
                underline='always'
                rel='noreferrer'
              >
                Reach out to our Slack channel
              </Anchor>
            </Typography>
          </Flex>
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout
      wrapperProps={{
        justify: 'flex-start',
      }}
      header={<Header />}
      footer={
        <Flex justify={'center'} w='100%' gap={'size/spacer/default'}>
          <Button
            variant='outline'
            label='Back'
            component={NavLink}
            to={'/file-synced'}
            leading='arrow_left_outline'
          />
          <Button label='Continue' onClick={handleContinue} disabled={!selectedProjectId} />
        </Flex>
      }
    >
      <Flex direction='column' gap={16} justify='flex-start' align='center'>
        <Dropdown
          label='Select a project'
          data={[
            ...userProjects.map(
              (project) =>
                ({
                  label: `${project.owner.name}/${project.name}`,
                  value: project.id,
                  icon: getPlatformIcon(repository?.platform),
                }) as ComboboxItem
            ),
            {
              label: `Disconnect from ${getPlatformDisplayName(repository?.platform)}`,
              value: '',
              icon: 'arrow_left_end_on_rectangle_outline',
              onClick: () => {
                navigate('/auth');
              },
            },
          ]}
          placeholder='Choose project...'
          value={selectedProjectId}
          onChange={updateSelectedProjectId}
        />
      </Flex>
    </Layout>
  );
}
