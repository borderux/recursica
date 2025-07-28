import { useRepository } from '../../hooks/useRepository';
import { useFigma } from '../../hooks/useFigma';
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

/**
 * @description The steps of the publish changes page
 * @enum {number}
 */
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
    error,
    clearError,
  } = useRepository();
  const { repository } = useFigma();
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

  // Handle error state
  useEffect(() => {
    if (error) {
      setStep(Step.Error);
    }
  }, [error]);

  const handleConfirm = async () => {
    setStep(Step.Exporting);
    clearError(); // Clear any previous errors
    try {
      await publishFiles();
    } catch (error) {
      console.error('Failed to publish files:', error);
      setStep(Step.Error);
    }
  };

  const handleInitializeRepo = async () => {
    clearError(); // Clear any previous errors
    try {
      initializeRepo();
      handleConfirm();
    } catch (error) {
      console.error('Failed to initialize repo:', error);
      setStep(Step.Error);
    }
  };

  const handleReset = async () => {
    clearError(); // Clear any previous errors
    const result = await resetRepository();
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
          leading: !prLink ? 'arrow_path_outline' : undefined,
          trailing: prLink ? 'arrow_right_outline' : undefined,
        };
      case Step.Exported:
        return {
          label: 'Done',
          onClick: handleReset,
        };
      case Step.Error:
        return {
          label: 'Back',
          onClick: () => {
            clearError();
            setStep(Step.SelectProject);
          },
          leading: 'arrow_left_outline',
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
        return 'arrow_path_outline';
      case FileStatus.Done:
        return 'check_outline';
      case FileStatus.Error:
        return 'exclamation_circle_outline';
      case FileStatus.Pending:
        return 'clock_outline';
    }
  };

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

  const getPlatformIcon = (platform: string | undefined): IconName => {
    switch (platform?.toLowerCase()) {
      case 'github':
        return 'github_outline';
      case 'gitlab':
        return 'gitlab_outline';
      default:
        return 'arrow_left_end_on_rectangle_outline';
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
              underline='never'
              href='https://www.recursica.com/community'
              target='_blank'
              rel='noopener noreferrer'
              leading='flag_outline'
            />
          )}
          {step === Step.Exported && (
            <Tooltip label='URL copied to clipboard' opened={copied}>
              <Button
                variant='outline'
                ref={copyButtonRef}
                disabled={!prLink}
                label='Copy URL'
                leading='paper_clip_outline'
                onClick={handleCopyErrorToClipboard}
              />
            </Tooltip>
          )}
        </Flex>
      }
      header={
        <Flex align='center' gap={24} w='100%' justify='space-between'>
          <Flex flex={1}>
            <Dropdown
              label='Pick a project'
              readOnly={step !== Step.SelectProject && step !== Step.InvalidProject}
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
              showLabel={false}
              placeholder='Select a project...'
              value={selectedProjectId}
              onChange={(value) => {
                if (value) {
                  updateSelectedProjectId(value);
                }
              }}
            />
          </Flex>
          <Logo size='small' onClick={() => navigate('/home')} />
        </Flex>
      }
    >
      <Flex direction='column' gap={16} justify='center' align='center'>
        {step === Step.InvalidProject && (
          <Typography variant='body-1/normal' color='layers/layer-0/elements/text/color'>
            This project is missing the required Recursica configuration file. Please initialize the
            repo with the correct UI Kit.
          </Typography>
        )}
        {step === Step.SelectProject && (
          <Typography
            variant='body-2/normal'
            color='layers/layer-0/elements/text/color'
            opacity={0.84}
          >
            {selectedProjectId
              ? `Once changes are made to the Figma files, publish them to the connected ${getPlatformDisplayName(repository?.platform)} project.`
              : `It looks like there are multiple projects associated with your ${getPlatformDisplayName(repository?.platform)} account.`}
          </Typography>
        )}
        {step === Step.Exporting && (
          <Flex direction='column' gap={8} w='100%'>
            {Object.entries(filesStatus).map(([key, value]) => (
              <Flex gap={8} key={key} align='center'>
                <Icon name={getIcon(value.status)} spin={value.status === FileStatus.Loading} />
                <Typography variant='body-2/normal' color='layers/layer-0/elements/text/color'>
                  {value.quantity > 0
                    ? `${parseInt(value.quantity).toLocaleString()} ${key}`
                    : `No ${key} found`}
                </Typography>
              </Flex>
            ))}
          </Flex>
        )}
        {step === Step.Exported && (
          <Typography
            variant='body-2/normal'
            color='layers/layer-0/elements/text/color'
            opacity={0.84}
          >
            The changes have been published.
            <br />
            Copy and send the URL to your developer.
          </Typography>
        )}
        {step === Step.Error && (
          <Flex direction='column' gap={16} align='center'>
            <Typography variant='body-1/normal' color='layers/layer-0/elements/text/color'>
              {error?.message || 'An error occurred while publishing files'}
            </Typography>
            {error?.details && (
              <Typography
                variant='body-2/normal'
                color='layers/layer-0/elements/text/color'
                opacity={0.84}
              >
                {error.details}
              </Typography>
            )}
            {error?.code && (
              <Typography
                variant='body-2/normal'
                color='layers/layer-0/elements/text/color'
                opacity={0.84}
              >
                Error code: {error.code}
              </Typography>
            )}
          </Flex>
        )}
      </Flex>
    </Layout>
  );
}
