import { useState, useCallback } from 'react';
import type { RecursicaConfiguration } from '@recursica/schemas';
import type { BaseRepository, Project } from '../services/repository';

export enum ValidationStatus {
  Valid,
  Invalid,
  NotSelected,
}

export function useProjectValidation() {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(
    ValidationStatus.NotSelected
  );

  const validateProject = useCallback(
    async (
      repositoryInstance: BaseRepository | null,
      selectedProject: Project | undefined,
      getConfig: (
        repositoryInstance: BaseRepository | null,
        selectedProject: Project | undefined,
        targetBranch: string
      ) => Promise<{ config: RecursicaConfiguration; shouldCreateInit: boolean }>
    ): Promise<boolean> => {
      if (!repositoryInstance) return false;

      try {
        const { config, shouldCreateInit } = await getConfig(
          repositoryInstance,
          selectedProject,
          selectedProject?.defaultBranch || ''
        );
        const isValid = !shouldCreateInit && config.project !== undefined;
        setValidationStatus(isValid ? ValidationStatus.Valid : ValidationStatus.Invalid);
        return isValid;
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          console.error('Project is not valid');
          setValidationStatus(ValidationStatus.Invalid);
          return false;
        }
        throw error;
      }
    },
    []
  );

  const resetValidationStatus = useCallback(() => {
    setValidationStatus(ValidationStatus.NotSelected);
  }, []);

  return {
    validationStatus,
    validateProject,
    resetValidationStatus,
  };
}
