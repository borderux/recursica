import { useRepository } from '../../hooks/useRepository';
import {
  Typography,
  Flex,
  Dropdown,
  Button,
  Logo,
  ButtonProps,
  ComboboxItem,
  Anchor,
  copyToClipboard,
  Tooltip,
  Icon,
  IconName,
} from '@recursica/ui-kit';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Layout } from '../../components/Layout/Layout';
import { FileStatus, ValidationStatus } from '../../context/Repository/RepositoryProvider';

enum Step {
  SelectProject,
  InvalidProject,
  Exporting,
  Exported,
  Error,
}

export function PublishChanges() {
  const {
    userProjects,
    selectedProjectId,
    updateSelectedProjectId,
    publishFiles,
    prLink,
    filesStatus,
    validationStatus,
    initializeRepo,
    resetRepository,
  } = useRepository();
  const [step, setStep] = useState<Step>(Step.SelectProject);
  const navigate = useNavigate();
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step === Step.Exporting) return;
    if (validationStatus === ValidationStatus.NotSelected) {
      setStep(Step.SelectProject);
    }
    if (validationStatus === ValidationStatus.Valid) {
      setStep(Step.SelectProject);
    }
    if (validationStatus === ValidationStatus.Invalid) {
      setStep(Step.InvalidProject);
    }
  }, [validationStatus]);

  const handleConfirm = async () => {
    setStep(Step.Exporting);
    try {
      publishFiles();
    } catch (error) {
      console.error('Failed to publish files:', error);
      setStep(Step.Error);
    }
  };

  const handleInitializeRepo = async () => {
    try {
      initializeRepo();
      handleConfirm();
    } catch (error) {
      console.error('Failed to initialize repo:', error);
      setStep(Step.Error);
    }
  };

  const handleReset = async () => {
    const result = await resetRepository();
    console.log('project reset: ', result);
    if (result) {
      setStep(Step.SelectProject);
    }
    if (!result) {
      setStep(Step.InvalidProject);
    }
  };

  const getFooter = (): ButtonProps => {
    switch (step) {
      case Step.SelectProject:
        return {
          label: 'Publish changes',
          onClick: handleConfirm,
          disabled: !selectedProjectId || validationStatus !== ValidationStatus.Valid,
        };
      case Step.InvalidProject:
        return {
          label: 'Initialize Repo',
          onClick: handleInitializeRepo,
        };
      case Step.Exporting:
        return {
          label: !prLink ? 'Publishing...' : 'Next',
          disabled: !prLink,
          onClick: () => setStep(Step.Exported),
          leftSection: !prLink ? 'cached_Outlined' : undefined,
          rightSection: prLink ? 'arrow_forward_Outlined' : undefined,
        };
      case Step.Exported:
        return {
          label: 'Done',
          onClick: handleReset,
        };
      case Step.Error:
        return {
          label: 'Back',
          disabled: true,
          leftSection: 'arrow_back_Outlined',
        };
    }
  };

  const handleCopyErrorToClipboard = () => {
    if (!prLink) return;
    copyToClipboard(prLink, copyButtonRef).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const getIcon = (status: FileStatus): IconName => {
    switch (status) {
      case FileStatus.Loading:
        return 'cached_Outlined';
      case FileStatus.Done:
        return 'check_Outlined';
      case FileStatus.Error:
        return 'warning_amber_Outlined';
      case FileStatus.Pending:
        return 'pending_Outlined';
    }
  };

  return (
    <Layout
      footer={
        <Flex
          justify={step === Step.Error || step === Step.Exported ? 'space-between' : 'center'}
          w='100%'
        >
          <Button {...getFooter()} />
          {step === Step.Error && (
            <Button
              variant='outline'
              label='Send bug'
              component={Anchor}
              href='https://github.com/recursica/figma-plugin/issues'
              target='_blank'
              rel='noopener noreferrer'
              leftSection='bug_report_Outlined'
            />
          )}
          {step === Step.Exported && (
            <Tooltip label='URL copied to clipboard' opened={copied}>
              <Button
                variant='outline'
                ref={copyButtonRef}
                disabled={!prLink}
                label='Copy URL'
                leftSection='link_Outlined'
                onClick={handleCopyErrorToClipboard}
              />
            </Tooltip>
          )}
        </Flex>
      }
      header={
        <Flex align='center' gap={24}>
          <Dropdown
            label='Pick a project'
            readOnly={step !== Step.SelectProject && step !== Step.InvalidProject}
            data={[
              ...userProjects.map(
                (project) =>
                  ({
                    label: project.name,
                    value: project.id,
                  }) as ComboboxItem
              ),
              {
                label: 'Disconnect from repository',
                value: '',
                onClick: () => {
                  navigate('/auth');
                },
              },
            ]}
            showLabel={false}
            placeholder='Select a project...'
            value={selectedProjectId}
            onChange={(value) => {
              if (value) {
                updateSelectedProjectId(value);
              }
            }}
          />
          <Logo size='small' onClick={() => navigate('/home')} />
        </Flex>
      }
    >
      <Flex direction='column' gap={16} justify='center' align='center'>
        {step === Step.InvalidProject && (
          <Typography variant='body-1/normal' color='color-on/background/high-emphasis'>
            This project is missing the required Recursica configuration file. Please initialize the
            repo with the correct ui kit.
          </Typography>
        )}
        {step === Step.SelectProject && (
          <>
            <Typography variant='body-2/normal' color='color-on/background/medium-emphasis'>
              Once you’re made changes to the Figma files, publish them to the connected Github
              project
            </Typography>
          </>
        )}
        {step === Step.Exporting && (
          <>
            <Flex direction='column' gap={8}>
              {Object.entries(filesStatus).map(([key, value]) => (
                <Flex align='center' gap={8} key={key}>
                  <Icon name={getIcon(value.status)} />
                  <Typography variant='body-2/normal' color='menu-item/color/text-default'>
                    {parseInt(value.quantity).toLocaleString()} {key}
                  </Typography>
                </Flex>
              ))}
            </Flex>
          </>
        )}
        {step === Step.Exported && (
          <Typography variant='body-2/normal' color='color-on/background/medium-emphasis'>
            The changes have been published.
            <br />
            If you’re ready for the dev to review the changes, send them the URL of your branch.
          </Typography>
        )}
        {step === Step.Error && (
          <Typography variant='body-2/normal' color='color-on/background/medium-emphasis'>
            Error message
          </Typography>
        )}
      </Flex>
    </Layout>
  );
}
