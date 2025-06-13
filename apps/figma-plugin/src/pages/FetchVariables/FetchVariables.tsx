import { useFigma } from '../../hooks/useFigma';
import { Typography, Button } from '@recursica/ui-kit';

import { NavLink } from 'react-router';

export function FetchVariables() {
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
