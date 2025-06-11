import { FigmaContext } from '@/context';
import { useContext } from 'react';

export function useFigma() {
  const context = useContext(FigmaContext);
  if (!context) {
    throw new Error('Figma context not found');
  }
  return context;
}
