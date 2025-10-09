import { useEffect, useMemo, useState, useCallback } from 'react';
import { useFigma } from './useFigma';
import type { Project } from '../services/repository';

interface FileData {
  localIconsJson: string | null;
  localBundledJson: string | null;
  remoteIconsJson: string | null;
  remoteBundledJson: string | null;
  iconsFilename: string;
  bundledFilename: string;
}

export function useFileData(selectedProject?: Project) {
  // Local and remote file data state
  const [localVariablesJson, setLocalVariablesJson] = useState<string | null>(null);
  const [localIconsJson, setLocalIconsJson] = useState<string | null>(null);
  const [remoteVariablesJson, setRemoteVariablesJson] = useState<string | null>(null);
  const [remoteIconsJson, setRemoteIconsJson] = useState<string | null>(null);

  const { recursicaVariables, svgIcons } = useFigma();

  // Update local data when Figma data changes
  useEffect(() => {
    if (recursicaVariables) {
      const variablesData = { ...recursicaVariables };
      setLocalVariablesJson(JSON.stringify(variablesData, null, 2));
    } else {
      setLocalVariablesJson(null);
    }
  }, [recursicaVariables, selectedProject]);

  useEffect(() => {
    if (svgIcons) {
      setLocalIconsJson(JSON.stringify(svgIcons, null, 2));
    } else {
      setLocalIconsJson(null);
    }
  }, [svgIcons]);

  // Abstracted file loading logic
  const fileLoadingData = useMemo((): FileData => {
    const data = {
      localIconsJson,
      localBundledJson: localVariablesJson,
      remoteIconsJson,
      remoteBundledJson: remoteVariablesJson,
      iconsFilename: 'recursica-icons.json',
      bundledFilename: 'recursica-bundle.json',
    };

    return data;
  }, [localIconsJson, localVariablesJson, remoteIconsJson, remoteVariablesJson]);

  const clearRemoteData = useCallback(() => {
    setRemoteVariablesJson(null);
    setRemoteIconsJson(null);
  }, [setRemoteVariablesJson, setRemoteIconsJson]);

  return {
    fileLoadingData,
    setRemoteVariablesJson,
    setRemoteIconsJson,
    clearRemoteData,
  };
}
