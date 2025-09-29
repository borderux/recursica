import { useState, useEffect } from 'react';
import { VersionCheckService } from '../services/versionCheck';
import type { VersionCheckResult } from '../services/versionCheck';

export function useVersionCheck() {
  const [updateInfo, setUpdateInfo] = useState<VersionCheckResult | null>(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  const checkForUpdates = async () => {
    const pluginMode = import.meta.env.VITE_PLUGIN_MODE;
    if (pluginMode === 'test' || pluginMode === 'development') {
      const versionCheckService = new VersionCheckService();
      const result = await versionCheckService.checkForUpdates('0.0.11');
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
  }, []);

  return {
    updateInfo,
    showUpdateNotification,
    checkForUpdates,
    dismissUpdateNotification,
    downloadUpdate,
  };
}
