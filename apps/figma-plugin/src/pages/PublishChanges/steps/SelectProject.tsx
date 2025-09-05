import { useRepository } from '../../../hooks/useRepository';
import { useFigma } from '../../../hooks/useFigma';
import { NavLink, useNavigate } from 'react-router';
import {
  Typography,
  Flex,
  Dropdown,
  Button,
  ComboboxItem,
  Box,
  IconName,
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

export function SelectProject() {
  const { userProjects, selectedProjectId, updateSelectedProjectId } = useRepository();
  const { repository } = useFigma();
  const navigate = useNavigate();

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

  return (
    <Layout
      wrapperProps={{
        justify: 'flex-start',
      }}
      header={
        <Box w='100%'>
          <Typography textAlign='left' variant='body-1/strong'>
            Connect a Git repository
          </Typography>
        </Box>
      }
      footer={
        <Flex justify={'center'} w='100%' gap={'size/spacer/default'}>
          <Button
            variant='outline'
            label='Back'
            component={NavLink}
            to={'/file-synced'}
            leading='arrow_left_outline'
            rel='noopener noreferrer'
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
