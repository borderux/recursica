import { Flex, Typography, Button, Icon, Box } from '@recursica/ui-kit-mantine';
import { VersionCheckResult } from '../../services/versionCheck';

export interface UpdateNotificationProps {
  updateInfo: VersionCheckResult;
  onDismiss: () => void;
  onDownload: () => void;
}

export function UpdateNotification({ updateInfo, onDismiss, onDownload }: UpdateNotificationProps) {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        style={{
          backgroundColor: 'var(--mantine-color-white)',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Flex direction='column' gap='size/spacer/2x' align='center'>
          {/* Header with icon */}
          <Flex direction='row' align='center' gap='size/spacer/0-5x'>
            <Icon name='arrow_path_outline' size={24} />
            <Typography variant='h6' color='layers/layer-1/elements/text/color'>
              Update Available
              {updateInfo.pluginMode !== 'production' && (
                <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '8px' }}>
                  ({updateInfo.pluginMode.toUpperCase()})
                </span>
              )}
            </Typography>
          </Flex>

          {/* Version info */}
          <Flex direction='column' gap='size/spacer/0-5x' align='center'>
            <Typography
              variant='body-1/normal'
              color='layers/layer-1/elements/text/color'
              textAlign='center'
            >
              A new version of the Recursica Figma plugin is available!
            </Typography>
            <Flex direction='row' gap='size/spacer/0-5x' align='center'>
              <Typography variant='caption' color='layers/layer-1/elements/text/color'>
                Current: v{updateInfo.currentVersion}
              </Typography>
              <Icon name='arrow_right_outline' size={16} />
              <Typography variant='caption' color='layers/layer-1/elements/text/color'>
                Latest: v{updateInfo.latestVersion}
              </Typography>
            </Flex>
          </Flex>

          {/* Release notes preview */}
          {updateInfo.releaseNotes && (
            <Box
              style={{
                backgroundColor: 'var(--mantine-color-gray-0)',
                padding: '12px',
                borderRadius: '4px',
                maxHeight: '100px',
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <Typography variant='caption' color='layers/layer-1/elements/text/color'>
                {updateInfo.releaseNotes.substring(0, 200)}
                {updateInfo.releaseNotes.length > 200 ? '...' : ''}
              </Typography>
            </Box>
          )}

          {/* Action buttons */}
          <Flex direction='row' gap='size/spacer/1-5x' w='100%'>
            <Button label='Later' variant='outline' onClick={onDismiss} style={{ flex: 1 }} />
            <Button label='Download' variant='solid' onClick={onDownload} style={{ flex: 1 }} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
