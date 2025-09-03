import { useCallback } from 'react';
import type { RecursicaConfiguration } from '@recursica/schemas';
import type { BaseRepository, Project } from '../services/repository';

interface AdapterFile {
  path: string;
  content: string;
}

interface WorkerMessage {
  bundledJson: string;
  srcPath: string;
  project: unknown;
  rootPath: string;
  iconsJson: string;
  overrides?: unknown;
  iconsConfig?: unknown;
}

export function useAdapterWorker() {
  const runAdapter = useCallback(
    async (
      repositoryInstance: BaseRepository,
      selectedProject: Project,
      targetBranch: string,
      config: RecursicaConfiguration,
      fileLoadingData: {
        localIconsJson: string | null;
        localBundledJson: string | null;
        remoteIconsJson: string | null;
        remoteBundledJson: string | null;
      }
    ): Promise<AdapterFile[]> => {
      if (!repositoryInstance || !selectedProject) {
        throw new Error('Failed to run adapter');
      }

      let rootPath = '';
      if (typeof config.project === 'object' && config.project.root) {
        rootPath = config.project.root;
      }

      let adapterPath = 'adapter.js';
      if (rootPath) {
        adapterPath = rootPath + '/' + adapterPath;
      }
      if (typeof config.project === 'object' && config.project.adapter) {
        adapterPath = config.project.adapter;
      }

      let adapterFile = null;
      try {
        adapterFile = await repositoryInstance.getSingleFile(
          selectedProject,
          adapterPath,
          targetBranch
        );
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          console.error('Adapter file not found');
          return [];
        }
        throw error;
      }

      // Use local data if available, otherwise use remote data
      const iconsJson = fileLoadingData.localIconsJson || '{}';
      const bundledJson = fileLoadingData.localBundledJson || '{}';

      return new Promise<AdapterFile[]>((resolve, reject) => {
        let worker: Worker;

        try {
          // Create worker with error handling
          worker = new Worker(
            URL.createObjectURL(new Blob([adapterFile], { type: 'text/javascript' }))
          );
        } catch (error) {
          console.error('❌ Failed to create worker:', error);
          reject(
            new Error(
              `Failed to create worker: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
          return;
        }

        // Set a timeout for the worker (5 minutes)
        const timeoutId = setTimeout(
          () => {
            console.error('❌ Worker execution timed out after 5 minutes');
            worker.terminate();
            reject(new Error('Worker execution timed out after 5 minutes'));
          },
          5 * 60 * 1000
        );

        try {
          const message: WorkerMessage = {
            bundledJson,
            srcPath: rootPath + '/src',
            project: config.project,
            rootPath,
            iconsJson,
            overrides: config.overrides,
            iconsConfig: config.icons,
          };
          worker.postMessage(message);
        } catch (error) {
          clearTimeout(timeoutId);
          worker.terminate();
          console.error('❌ Failed to post message to worker:', error);
          reject(
            new Error(
              `Failed to post message to worker: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
          );
          return;
        }

        // Listener for messages coming FROM the worker
        worker.onmessage = (event) => {
          clearTimeout(timeoutId); // Clear timeout on successful response
          worker.terminate(); // Clean up worker
          console.log('✅ Response received from worker:', event.data);

          const response = event.data;
          if (Array.isArray(response)) {
            resolve(response);
          } else {
            reject(new Error('Worker returned invalid data'));
          }
        };

        // Listener for any errors that might occur inside the worker
        worker.onerror = (error) => {
          clearTimeout(timeoutId); // Clear timeout on error
          worker.terminate(); // Clean up worker
          console.error('❌ Error in worker:', error);

          // Update UI status immediately

          // Create a more detailed error message
          const errorMessage = error.message || 'Unknown worker error';
          const errorDetails = error.filename
            ? `File: ${error.filename}, Line: ${error.lineno}`
            : '';
          const fullError = `Worker execution failed: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`;

          reject(new Error(fullError));
        };

        // Handle worker message errors
        worker.onmessageerror = (error) => {
          clearTimeout(timeoutId); // Clear timeout on message error
          worker.terminate(); // Clean up worker
          console.error('❌ Message error in worker:', error);

          // Update UI status immediately

          reject(new Error(`Worker message error: Unable to process worker message`));
        };
      });
    },
    []
  );

  return {
    runAdapter,
  };
}
