import { RepositoryContext } from '@/context/Repository/RepositoryContext';
import { useContext } from 'react';

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error('Repository context not found');
  }
  return context;
}
