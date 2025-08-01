import { useState, useCallback } from 'react';

export enum FileStatus {
  Error,
  Pending,
  Loading,
  Done,
}

export interface Status {
  quantity: number;
  status: FileStatus;
}

export interface FilesStatus {
  icons: Status;
  uiKit: Status;
  tokens: Status;
  themes: Status;
  adapter: Status;
}

const INITIAL_FILES_STATUS: FilesStatus = {
  icons: { quantity: 0, status: FileStatus.Pending },
  uiKit: { quantity: 0, status: FileStatus.Pending },
  tokens: { quantity: 0, status: FileStatus.Pending },
  themes: { quantity: 0, status: FileStatus.Pending },
  adapter: { quantity: 0, status: FileStatus.Pending },
};

export function useFileStatus() {
  const [filesStatus, setFilesStatus] = useState<FilesStatus>(INITIAL_FILES_STATUS);

  const updateFilesStatus = useCallback((vars: string | null, icons: string | null) => {
    if (vars) {
      const bundledFileRaw = JSON.parse(vars);
      setFilesStatus((prev) => ({
        ...prev,
        tokens: {
          quantity: Object.keys(bundledFileRaw.tokens).length,
          status: FileStatus.Loading,
        },
        themes: {
          quantity: Object.keys(bundledFileRaw.themes).length,
          status: FileStatus.Loading,
        },
        uiKit: {
          quantity: Object.keys(bundledFileRaw.uiKit).length,
          status: FileStatus.Loading,
        },
      }));
    }
    if (icons) {
      const iconsFileRaw = JSON.parse(icons);
      setFilesStatus((prev) => ({
        ...prev,
        icons: { quantity: Object.keys(iconsFileRaw).length, status: FileStatus.Loading },
      }));
    }
  }, []);

  const updateAdapterStatus = useCallback((status: FileStatus, quantity: number = 1) => {
    setFilesStatus((prev) => ({
      ...prev,
      adapter: { quantity, status },
    }));
  }, []);

  const updateAllStatusesToDone = useCallback(() => {
    setFilesStatus((prev) => ({
      ...prev,
      icons: { ...prev.icons, status: FileStatus.Done },
      uiKit: { ...prev.uiKit, status: FileStatus.Done },
      tokens: { ...prev.tokens, status: FileStatus.Done },
      themes: { ...prev.themes, status: FileStatus.Done },
    }));
  }, []);

  const resetFilesStatus = useCallback(() => {
    setFilesStatus(INITIAL_FILES_STATUS);
  }, []);

  return {
    filesStatus,
    updateFilesStatus,
    updateAdapterStatus,
    updateAllStatusesToDone,
    resetFilesStatus,
  };
}
