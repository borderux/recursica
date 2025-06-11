import { useRepository } from '@/hooks/useRepository';
import { Typography, Flex, Select, Button } from '@recursica/ui-kit';
import { NavLink } from 'react-router';

export function SelectProject() {
  const { userProjects, selectedProjectId, updateSelectedProjectId, runAdapter } = useRepository();

  return (
    <Flex direction='column' gap={16} justify='center'>
      <Typography>Select Project</Typography>
      <Select
        data={userProjects.map((project) => ({
          label: project.name,
          value: project.id,
        }))}
        value={selectedProjectId}
        onChange={(value) => {
          if (value) {
            updateSelectedProjectId(value);
          }
        }}
      />
      {selectedProjectId && (
        <Button
          label='Run adapter'
          onClick={runAdapter}
          component={NavLink}
          to='/recursica/run-adapter'
        />
      )}
    </Flex>
  );
}
