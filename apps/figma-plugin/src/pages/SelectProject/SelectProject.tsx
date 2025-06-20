import { useRepository } from '../../hooks/useRepository';
import { Typography, Flex, Dropdown, Button, Chip } from '@recursica/ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router';

enum Step {
  SelectProject = 0,
  Confirmation = 1,
  Exporting = 2,
}

export function SelectProject() {
  const {
    userProjects,
    selectedProject,
    selectedProjectId,
    updateSelectedProjectId,
    publishFiles,
  } = useRepository();
  const [step, setStep] = useState<Step>(Step.SelectProject);
  const navigate = useNavigate();

  const handleConnect = () => {
    setStep(Step.Confirmation);
  };

  const handleConfirm = async () => {
    setStep(Step.Exporting);
    try {
      await publishFiles();
      navigate('/recursica/success');
    } catch (error) {
      console.error('Failed to publish files:', error);
      navigate('/recursica/error');
    }
  };

  return (
    <Flex direction='column' gap={16} justify='center' align='center'>
      {step === Step.SelectProject && (
        <>
          <Typography variant='h6'>Pick a project</Typography>
          <Dropdown
            label='Pick a project'
            data={userProjects.map((project) => ({
              label: project.name,
              value: project.id,
            }))}
            showLabel={false}
            value={selectedProjectId}
            onChange={(value) => {
              if (value) {
                updateSelectedProjectId(value);
              }
            }}
          />
          <Button label='Connect' onClick={handleConnect} disabled={!selectedProjectId} />
        </>
      )}
      {step === Step.Confirmation && (
        <>
          {selectedProject && (
            <Chip
              icon={{
                unselected: 'favorite_Filled',
                selected: 'favorite_Filled',
              }}
              label={`${selectedProject.owner.name}/${selectedProject.name}`}
            />
          )}
          <Typography variant='body-1/normal' textAlign='center'>
            Are you sure?
            <br />
            This will create a branch.
          </Typography>
          <Button leftSection='publish_Outlined' label='Export JSON' onClick={handleConfirm} />
        </>
      )}
      {step === Step.Exporting && (
        <>
          <Typography variant='h6'>Exporting...</Typography>
        </>
      )}
    </Flex>
  );
}
