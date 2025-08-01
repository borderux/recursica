import { PublishChanges, Home, Auth, FileSynced, Error } from './pages';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, Themes } from '@recursica/ui-kit-mantine';
import { RepositoryProvider } from './context/Repository/RepositoryProvider';
import { FigmaProvider } from './context';

function App() {
  return (
    <ThemeProvider themeClassname={Themes.Default.Light}>
      <FigmaProvider>
        <RepositoryProvider>
          <MemoryRouter initialEntries={['/home']}>
            <Routes>
              <Route path='home' element={<Home />} />
              <Route path='auth' element={<Auth />} />
              <Route path='file-synced' element={<FileSynced />} />
              <Route path='publish' element={<PublishChanges />} />
              <Route path='error' element={<Error />} />
            </Routes>
          </MemoryRouter>
        </RepositoryProvider>
      </FigmaProvider>
    </ThemeProvider>
  );
}

export default App;
