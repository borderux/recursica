import { PublishChanges, Home, Success, Error, Auth } from './pages';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, Themes } from '@recursica/ui-kit';
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
              <Route path='publish' element={<PublishChanges />} />
              <Route path='success' element={<Success />} />
              <Route path='error' element={<Error />} />
            </Routes>
          </MemoryRouter>
        </RepositoryProvider>
      </FigmaProvider>
    </ThemeProvider>
  );
}

export default App;
