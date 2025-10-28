import { useState, useEffect } from 'react';
import { VersionCheckService } from '../services/versionCheck';
import type { VersionCheckResult } from '../services/versionCheck';
import { useFigma } from './useFigma';

export function useVersionCheck() {
  const [updateInfo, setUpdateInfo] = useState<VersionCheckResult | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const { pluginVersion } = useFigma();

  const checkForUpdates = async () => {
    const pluginMode = import.meta.env.VITE_PLUGIN_MODE;
    if (pluginMode === 'test' && pluginVersion) {
      const versionCheckService = new VersionCheckService();
      const result = await versionCheckService.checkForUpdates(pluginVersion);
      setUpdateInfo(result);
      if (result.hasUpdate) {
        setShowUpdateNotification(true);
      }
    }
  };

  const dismissUpdateNotification = () => {
    setShowUpdateNotification(false);
  };

  const downloadUpdate = () => {
    if (updateInfo?.releaseUrl) {
      window.open(updateInfo.releaseUrl, '_blank');
    }
    setShowUpdateNotification(false);
  };

  useEffect(() => {
    checkForUpdates();
  }, [pluginVersion]);

  return {
    updateInfo,
    showUpdateNotification,
    checkForUpdates,
    dismissUpdateNotification,
    downloadUpdate,
  };
}
