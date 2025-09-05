import { Routes, Route, Navigate, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useRepository } from '../../hooks/useRepository';
import { SelectProject, Publish, Publishing, Error } from './steps';
export function PublishChanges() {
  const { error } = useRepository();
  const navigate = useNavigate();

  // Handle error state
  useEffect(() => {
    if (error) {
      navigate('/publish/error', { replace: true });
    }
  }, [error, navigate]);

  return (
    <Routes>
      <Route path='select-project' element={<SelectProject />} />
      <Route path='home' element={<Publish />} />
      <Route path='publishing' element={<Publishing />} />
      <Route path='error' element={<Error />} />
      <Route path='*' element={<Navigate to='select-project' replace />} />
    </Routes>
  );
}
