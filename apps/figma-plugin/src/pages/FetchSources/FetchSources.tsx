import { useFigma } from '@/hooks/useFigma';
import { Typography, Button } from '@/ui-kit/components';
import { NavLink } from 'react-router';

export function FetchSources() {
  const {
    libraries: { recursicaVariables },
  } = useFigma();
  return (
    <>
      {recursicaVariables ? (
        <Typography>Recursica Variables</Typography>
      ) : (
        <Typography>Loading variables...</Typography>
      )}
      {recursicaVariables && (
        <Button label='Publish Variables' component={NavLink} to='/recursica/token' />
      )}
    </>
  );
}
