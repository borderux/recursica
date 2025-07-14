import { PublishChanges, Home, Auth } from './pages';
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
            </Routes>
          </MemoryRouter>
        </RepositoryProvider>
      </FigmaProvider>
    </ThemeProvider>
  );
}

export default App;
