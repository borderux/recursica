import { FigmaProvider } from './context';
import { SelectProject, Home, RepositoryConnection, Success, Error } from './pages';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, Themes } from '@recursica/ui-kit';
import { Layout } from './components';
import { RepositoryProvider } from './context/Repository/RepositoryProvider';

function App() {
  return (
    <ThemeProvider themeClassname={Themes.Default.Light}>
      <FigmaProvider>
        <RepositoryProvider>
          <MemoryRouter initialEntries={['/home']}>
            <Routes>
              <Route path='home' element={<Home />} />
              <Route path='/' element={<Layout />}>
                <Route path='recursica'>
                  <Route path='token' element={<RepositoryConnection />} />
                  <Route path='select-project' element={<SelectProject />} />
                  <Route path='success' element={<Success />} />
                  <Route path='error' element={<Error />} />
                </Route>
              </Route>
            </Routes>
          </MemoryRouter>
        </RepositoryProvider>
      </FigmaProvider>
    </ThemeProvider>
  );
}

export default App;
